import { nativeBuildVersion } from "expo-application";
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import * as Updates from "expo-updates";
import { Alert, AppState, AppStateStatus, Platform } from "react-native";

const MINIMUM_MINIMIZE_TIME = 15 * 60e3;
const BACKGROUND_UPDATE_TASK = "background-update-check";

const performBackgroundUpdateCheck = async (): Promise<BackgroundTask.BackgroundTaskResult> => {
  try {
    if (__DEV__ || Updates.isEmergencyLaunch) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    await Updates.setExtraParamAsync(
      Platform.OS === "ios" ? "ios-build-number" : "android-build-number",
      `${nativeBuildVersion}`,
    );
    await Updates.setExtraParamAsync("channel", Updates.channel || "unknown");

    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();

      const shouldAutoApply = Updates.channel !== "preview" && Updates.channel !== "testflight";

      if (shouldAutoApply) {
        await Updates.reloadAsync();
      }
    }

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("Background update check failed:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
};

TaskManager.defineTask(BACKGROUND_UPDATE_TASK, performBackgroundUpdateCheck);

export class UpdateService {
  private lastMinimize: number = 0;
  private appState: AppStateStatus = "active";
  private appStateSubscription: any;

  async setExtraParams() {
    await Updates.setExtraParamAsync(
      Platform.OS === "ios" ? "ios-build-number" : "android-build-number",
      `${nativeBuildVersion}`,
    );
    await Updates.setExtraParamAsync("channel", Updates.channel || "unknown");
  }

  async checkForUpdates(): Promise<boolean> {
    if (__DEV__ || Updates.isEmergencyLaunch) {
      return false;
    }

    try {
      await this.setExtraParams();
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        if (Updates.channel === "preview" || Updates.channel === "testflight") {
          this.promptForUpdate();
        } else {
          await Updates.reloadAsync({
            reloadScreenOptions: {
              backgroundColor: "#F3F4F6",
              spinner: {
                enabled: true,
                size: "medium",
                color: "#D1FAE5",
              },
              fade: true,
            },
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private promptForUpdate() {
    Alert.alert("Update Available", "A new version of the app is available. Restart now?", [
      { text: "Not now", style: "cancel" },
      {
        text: "Restart",
        style: "default",
        onPress: async () => {
          await Updates.reloadAsync();
        },
      },
    ]);
  }

  async startBackgroundUpdateCheck() {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_UPDATE_TASK);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_UPDATE_TASK, {
        minimumInterval: 12 * 60,
      });
    }

    this.appStateSubscription = AppState.addEventListener("change", this.handleAppStateChange);
  }

  async stopBackgroundUpdateCheck() {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_UPDATE_TASK);
    if (isRegistered) {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_UPDATE_TASK);
    }
    this.appStateSubscription?.remove();
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (this.appState.match(/inactive|background/) && nextAppState === "active") {
      if (this.lastMinimize <= Date.now() - MINIMUM_MINIMIZE_TIME) {
        this.checkForUpdates();
      }
    } else {
      this.lastMinimize = Date.now();
    }
    this.appState = nextAppState;
  };
}

export const updateService = new UpdateService();