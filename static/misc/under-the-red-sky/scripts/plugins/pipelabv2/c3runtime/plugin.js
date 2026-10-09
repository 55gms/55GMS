// <stdin>
var C3 = globalThis.C3;
var PLUGIN_INFO = {
  id: "pipelabv2",
  type: "object",
  hasDomSide: true,
  hasWrapperExtension: void 0,
  Acts: {
    "InitializeSync": {
      "forward": (inst) => inst._Initialize
    },
    "Initialize": {
      "forward": (inst) => inst._Initialize
    },
    "InitializeV2": {
      "forward": (inst) => inst._Initialize
    },
    "AppendFileSync": {
      "forward": (inst) => inst._AppendFile
    },
    "AppendFile": {
      "forward": (inst) => inst._AppendFile
    },
    "AppendFileV2": {
      "forward": (inst) => inst._AppendFile
    },
    "CopyFileSync": {
      "forward": (inst) => inst._CopyFile
    },
    "CopyFile": {
      "forward": (inst) => inst._CopyFile
    },
    "CopyFileV2": {
      "forward": (inst) => inst._CopyFile
    },
    "FetchFileSizeSync": {
      "forward": (inst) => inst._FetchFileSize
    },
    "FetchFileSize": {
      "forward": (inst) => inst._FetchFileSize
    },
    "FetchFileSizeV2": {
      "forward": (inst) => inst._FetchFileSize
    },
    "CreateFolderSync": {
      "forward": (inst) => inst._CreateFolder
    },
    "CreateFolder": {
      "forward": (inst) => inst._CreateFolder
    },
    "CreateFolderV2": {
      "forward": (inst) => inst._CreateFolder
    },
    "DeleteFileSync": {
      "forward": (inst) => inst._DeleteFile
    },
    "DeleteFile": {
      "forward": (inst) => inst._DeleteFile
    },
    "DeleteFileV2": {
      "forward": (inst) => inst._DeleteFile
    },
    "ListFilesSync": {
      "forward": (inst) => inst._ListFiles
    },
    "ListFiles": {
      "forward": (inst) => inst._ListFiles
    },
    "ListFilesV2": {
      "forward": (inst) => inst._ListFiles
    },
    "MoveFileSync": {
      "forward": (inst) => inst._MoveFile
    },
    "MoveFile": {
      "forward": (inst) => inst._MoveFile
    },
    "MoveFileV2": {
      "forward": (inst) => inst._MoveFile
    },
    "OpenBrowserSync": {
      "forward": (inst) => inst._OpenBrowser
    },
    "OpenBrowser": {
      "forward": (inst) => inst._OpenBrowser
    },
    "OpenBrowserV2": {
      "forward": (inst) => inst._OpenBrowser
    },
    "ReadBinaryFileSync": {
      "forward": (inst) => inst._ReadBinaryFile
    },
    "ReadBinaryFile": {
      "forward": (inst) => inst._ReadBinaryFile
    },
    "ReadBinaryFileV2": {
      "forward": (inst) => inst._ReadBinaryFile
    },
    "RenameFileSync": {
      "forward": (inst) => inst._RenameFile
    },
    "RenameFile": {
      "forward": (inst) => inst._RenameFile
    },
    "RenameFileV2": {
      "forward": (inst) => inst._RenameFile
    },
    "RunFileSync": {
      "forward": (inst) => inst._RunFile
    },
    "RunFile": {
      "forward": (inst) => inst._RunFile
    },
    "RunFileV2": {
      "forward": (inst) => inst._RunFile
    },
    "ShellOpenSync": {
      "forward": (inst) => inst._ShellOpen
    },
    "ShellOpen": {
      "forward": (inst) => inst._ShellOpen
    },
    "ShellOpenV2": {
      "forward": (inst) => inst._ShellOpen
    },
    "ExplorerOpenSync": {
      "forward": (inst) => inst._ExplorerOpen
    },
    "ExplorerOpen": {
      "forward": (inst) => inst._ExplorerOpen
    },
    "ExplorerOpenV2": {
      "forward": (inst) => inst._ExplorerOpen
    },
    "WriteBinaryFileSync": {
      "forward": (inst) => inst._WriteBinaryFile
    },
    "WriteBinaryFile": {
      "forward": (inst) => inst._WriteBinaryFile
    },
    "WriteBinaryFileV2": {
      "forward": (inst) => inst._WriteBinaryFile
    },
    "WriteTextFileSync": {
      "forward": (inst) => inst._WriteTextFile
    },
    "WriteTextFile": {
      "forward": (inst) => inst._WriteTextFile
    },
    "WriteTextFileV2": {
      "forward": (inst) => inst._WriteTextFile
    },
    "WriteTextSync": {
      "forward": (inst) => inst._WriteText
    },
    "WriteText": {
      "forward": (inst) => inst._WriteText
    },
    "WriteTextV2": {
      "forward": (inst) => inst._WriteText
    },
    "ReadTextFileSync": {
      "forward": (inst) => inst._ReadTextFile
    },
    "ReadTextFile": {
      "forward": (inst) => inst._ReadTextFile
    },
    "ReadTextFileV2": {
      "forward": (inst) => inst._ReadTextFile
    },
    "CheckIfPathExistSync": {
      "forward": (inst) => inst._CheckIfPathExist
    },
    "CheckIfPathExist": {
      "forward": (inst) => inst._CheckIfPathExist
    },
    "CheckIfPathExistV2": {
      "forward": (inst) => inst._CheckIfPathExist
    },
    "ShowFolderDialogSync": {
      "forward": (inst) => inst._ShowFolderDialog
    },
    "ShowFolderDialog": {
      "forward": (inst) => inst._ShowFolderDialog
    },
    "ShowFolderDialogV2": {
      "forward": (inst) => inst._ShowFolderDialog
    },
    "ShowOpenDialogSync": {
      "forward": (inst) => inst._ShowOpenDialog
    },
    "ShowOpenDialog": {
      "forward": (inst) => inst._ShowOpenDialog
    },
    "ShowOpenDialogV2": {
      "forward": (inst) => inst._ShowOpenDialog
    },
    "ShowSaveDialogSync": {
      "forward": (inst) => inst._ShowSaveDialog
    },
    "ShowSaveDialog": {
      "forward": (inst) => inst._ShowSaveDialog
    },
    "ShowSaveDialogV2": {
      "forward": (inst) => inst._ShowSaveDialog
    },
    "MaximizeSync": {
      "forward": (inst) => inst._Maximize
    },
    "Maximize": {
      "forward": (inst) => inst._Maximize
    },
    "MaximizeV2": {
      "forward": (inst) => inst._Maximize
    },
    "MinimizeSync": {
      "forward": (inst) => inst._Minimize
    },
    "Minimize": {
      "forward": (inst) => inst._Minimize
    },
    "MinimizeV2": {
      "forward": (inst) => inst._Minimize
    },
    "RestoreSync": {
      "forward": (inst) => inst._Restore
    },
    "Restore": {
      "forward": (inst) => inst._Restore
    },
    "RestoreV2": {
      "forward": (inst) => inst._Restore
    },
    "RequestAttentionSync": {
      "forward": (inst) => inst._RequestAttention
    },
    "RequestAttention": {
      "forward": (inst) => inst._RequestAttention
    },
    "RequestAttentionV2": {
      "forward": (inst) => inst._RequestAttention
    },
    "SetAlwaysOnTopSync": {
      "forward": (inst) => inst._SetAlwaysOnTop
    },
    "SetAlwaysOnTop": {
      "forward": (inst) => inst._SetAlwaysOnTop
    },
    "SetAlwaysOnTopV2": {
      "forward": (inst) => inst._SetAlwaysOnTop
    },
    "SetHeightSync": {
      "forward": (inst) => inst._SetHeight
    },
    "SetHeight": {
      "forward": (inst) => inst._SetHeight
    },
    "SetHeightV2": {
      "forward": (inst) => inst._SetHeight
    },
    "SetMaximumSizeSync": {
      "forward": (inst) => inst._SetMaximumSize
    },
    "SetMaximumSize": {
      "forward": (inst) => inst._SetMaximumSize
    },
    "SetMaximumSizeV2": {
      "forward": (inst) => inst._SetMaximumSize
    },
    "SetMinimumSizeSync": {
      "forward": (inst) => inst._SetMinimumSize
    },
    "SetMinimumSize": {
      "forward": (inst) => inst._SetMinimumSize
    },
    "SetMinimumSizeV2": {
      "forward": (inst) => inst._SetMinimumSize
    },
    "SetResizableSync": {
      "forward": (inst) => inst._SetResizable
    },
    "SetResizable": {
      "forward": (inst) => inst._SetResizable
    },
    "SetResizableV2": {
      "forward": (inst) => inst._SetResizable
    },
    "SetTitleSync": {
      "forward": (inst) => inst._SetTitle
    },
    "SetTitle": {
      "forward": (inst) => inst._SetTitle
    },
    "SetTitleV2": {
      "forward": (inst) => inst._SetTitle
    },
    "SetWidthSync": {
      "forward": (inst) => inst._SetWidth
    },
    "SetWidth": {
      "forward": (inst) => inst._SetWidth
    },
    "SetWidthV2": {
      "forward": (inst) => inst._SetWidth
    },
    "SetXSync": {
      "forward": (inst) => inst._SetX
    },
    "SetX": {
      "forward": (inst) => inst._SetX
    },
    "SetXV2": {
      "forward": (inst) => inst._SetX
    },
    "SetYSync": {
      "forward": (inst) => inst._SetY
    },
    "SetY": {
      "forward": (inst) => inst._SetY
    },
    "SetYV2": {
      "forward": (inst) => inst._SetY
    },
    "ShowDevToolsSync": {
      "forward": (inst) => inst._ShowDevTools
    },
    "ShowDevTools": {
      "forward": (inst) => inst._ShowDevTools
    },
    "ShowDevToolsV2": {
      "forward": (inst) => inst._ShowDevTools
    },
    "UnmaximizeSync": {
      "forward": (inst) => inst._Unmaximize
    },
    "Unmaximize": {
      "forward": (inst) => inst._Unmaximize
    },
    "UnmaximizeV2": {
      "forward": (inst) => inst._Unmaximize
    },
    "SetFullscreenSync": {
      "forward": (inst) => inst._SetFullscreen
    },
    "SetFullscreen": {
      "forward": (inst) => inst._SetFullscreen
    },
    "SetFullscreenV2": {
      "forward": (inst) => inst._SetFullscreen
    },
    "ActivateAchievementSync": {
      "forward": (inst) => inst._ActivateAchievement
    },
    "ActivateAchievement": {
      "forward": (inst) => inst._ActivateAchievement
    },
    "ActivateAchievementV2": {
      "forward": (inst) => inst._ActivateAchievement
    },
    "ClearAchievementSync": {
      "forward": (inst) => inst._ClearAchievement
    },
    "ClearAchievement": {
      "forward": (inst) => inst._ClearAchievement
    },
    "ClearAchievementV2": {
      "forward": (inst) => inst._ClearAchievement
    },
    "CheckAchievementActivationStateSync": {
      "forward": (inst) => inst._CheckAchievementActivationState
    },
    "CheckAchievementActivationState": {
      "forward": (inst) => inst._CheckAchievementActivationState
    },
    "CheckAchievementActivationStateV2": {
      "forward": (inst) => inst._CheckAchievementActivationState
    },
    "SetRichPresenceSync": {
      "forward": (inst) => inst._SetRichPresence
    },
    "SetRichPresence": {
      "forward": (inst) => inst._SetRichPresence
    },
    "SetRichPresenceV2": {
      "forward": (inst) => inst._SetRichPresence
    },
    "DiscordSetActivitySync": {
      "forward": (inst) => inst._DiscordSetActivity
    },
    "DiscordSetActivity": {
      "forward": (inst) => inst._DiscordSetActivity
    },
    "DiscordSetActivityV2": {
      "forward": (inst) => inst._DiscordSetActivity
    },
    "LeaderboardUploadScoreSync": {
      "forward": (inst) => inst._LeaderboardUploadScore
    },
    "LeaderboardUploadScore": {
      "forward": (inst) => inst._LeaderboardUploadScore
    },
    "LeaderboardUploadScoreV2": {
      "forward": (inst) => inst._LeaderboardUploadScore
    },
    "LeaderboardUploadScoreWithMetadataSync": {
      "forward": (inst) => inst._LeaderboardUploadScoreWithMetadata
    },
    "LeaderboardUploadScoreWithMetadata": {
      "forward": (inst) => inst._LeaderboardUploadScoreWithMetadata
    },
    "LeaderboardUploadScoreWithMetadataV2": {
      "forward": (inst) => inst._LeaderboardUploadScoreWithMetadata
    },
    "LeaderboardDownloadScoreSync": {
      "forward": (inst) => inst._LeaderboardDownloadScore
    },
    "LeaderboardDownloadScore": {
      "forward": (inst) => inst._LeaderboardDownloadScore
    },
    "LeaderboardDownloadScoreV2": {
      "forward": (inst) => inst._LeaderboardDownloadScore
    },
    "ActivateToWebPageSync": {
      "forward": (inst) => inst._ActivateToWebPage
    },
    "ActivateToWebPage": {
      "forward": (inst) => inst._ActivateToWebPage
    },
    "ActivateToWebPageV2": {
      "forward": (inst) => inst._ActivateToWebPage
    },
    "ActivateToStoreSync": {
      "forward": (inst) => inst._ActivateToStore
    },
    "ActivateToStore": {
      "forward": (inst) => inst._ActivateToStore
    },
    "ActivateToStoreV2": {
      "forward": (inst) => inst._ActivateToStore
    },
    "GetSteamUILanguageSync": {
      "forward": (inst) => inst._GetSteamUILanguage
    },
    "GetSteamUILanguage": {
      "forward": (inst) => inst._GetSteamUILanguage
    },
    "GetSteamUILanguageV2": {
      "forward": (inst) => inst._GetSteamUILanguage
    },
    "GetAvailableGameLanguagesSync": {
      "forward": (inst) => inst._GetAvailableGameLanguages
    },
    "GetAvailableGameLanguages": {
      "forward": (inst) => inst._GetAvailableGameLanguages
    },
    "GetAvailableGameLanguagesV2": {
      "forward": (inst) => inst._GetAvailableGameLanguages
    },
    "GetCurrentGameLanguageSync": {
      "forward": (inst) => inst._GetCurrentGameLanguage
    },
    "GetCurrentGameLanguage": {
      "forward": (inst) => inst._GetCurrentGameLanguage
    },
    "GetCurrentGameLanguageV2": {
      "forward": (inst) => inst._GetCurrentGameLanguage
    },
    "TriggerScreenshotSync": {
      "forward": (inst) => inst._TriggerScreenshot
    },
    "TriggerScreenshot": {
      "forward": (inst) => inst._TriggerScreenshot
    },
    "TriggerScreenshotV2": {
      "forward": (inst) => inst._TriggerScreenshot
    },
    "SaveScreenshotFromURLSync": {
      "forward": (inst) => inst._SaveScreenshotFromURL
    },
    "SaveScreenshotFromURL": {
      "forward": (inst) => inst._SaveScreenshotFromURL
    },
    "SaveScreenshotFromURLV2": {
      "forward": (inst) => inst._SaveScreenshotFromURL
    },
    "AddScreenshotToLibrarySync": {
      "forward": (inst) => inst._AddScreenshotToLibrary
    },
    "AddScreenshotToLibrary": {
      "forward": (inst) => inst._AddScreenshotToLibrary
    },
    "AddScreenshotToLibraryV2": {
      "forward": (inst) => inst._AddScreenshotToLibrary
    },
    "CheckDLCIsInstalledSync": {
      "forward": (inst) => inst._CheckDLCIsInstalled
    },
    "CheckDLCIsInstalled": {
      "forward": (inst) => inst._CheckDLCIsInstalled
    },
    "CheckDLCIsInstalledV2": {
      "forward": (inst) => inst._CheckDLCIsInstalled
    },
    "ShowGamepadTextInputSync": {
      "forward": (inst) => inst._ShowGamepadTextInput
    },
    "ShowGamepadTextInput": {
      "forward": (inst) => inst._ShowGamepadTextInput
    },
    "ShowGamepadTextInputV2": {
      "forward": (inst) => inst._ShowGamepadTextInput
    },
    "ShowFloatingGamepadTextInputSync": {
      "forward": (inst) => inst._ShowFloatingGamepadTextInput
    },
    "ShowFloatingGamepadTextInput": {
      "forward": (inst) => inst._ShowFloatingGamepadTextInput
    },
    "ShowFloatingGamepadTextInputV2": {
      "forward": (inst) => inst._ShowFloatingGamepadTextInput
    },
    "CreateWorkshopItemSync": {
      "forward": (inst) => inst._CreateWorkshopItem
    },
    "CreateWorkshopItem": {
      "forward": (inst) => inst._CreateWorkshopItem
    },
    "CreateWorkshopItemV2": {
      "forward": (inst) => inst._CreateWorkshopItem
    },
    "UpdateWorkshopItemSync": {
      "forward": (inst) => inst._UpdateWorkshopItem
    },
    "UpdateWorkshopItem": {
      "forward": (inst) => inst._UpdateWorkshopItem
    },
    "UpdateWorkshopItemV2": {
      "forward": (inst) => inst._UpdateWorkshopItem
    },
    "GetSubscribedItemsWithMetadataSync": {
      "forward": (inst) => inst._GetSubscribedItemsWithMetadata
    },
    "GetSubscribedItemsWithMetadata": {
      "forward": (inst) => inst._GetSubscribedItemsWithMetadata
    },
    "GetSubscribedItemsWithMetadataV2": {
      "forward": (inst) => inst._GetSubscribedItemsWithMetadata
    },
    "DownloadWorkshopItemSync": {
      "forward": (inst) => inst._DownloadWorkshopItem
    },
    "DownloadWorkshopItem": {
      "forward": (inst) => inst._DownloadWorkshopItem
    },
    "DownloadWorkshopItemV2": {
      "forward": (inst) => inst._DownloadWorkshopItem
    },
    "DeleteWorkshopItemSync": {
      "forward": (inst) => inst._DeleteWorkshopItem
    },
    "DeleteWorkshopItem": {
      "forward": (inst) => inst._DeleteWorkshopItem
    },
    "DeleteWorkshopItemV2": {
      "forward": (inst) => inst._DeleteWorkshopItem
    },
    "SubscribeWorkshopItemSync": {
      "forward": (inst) => inst._SubscribeWorkshopItem
    },
    "SubscribeWorkshopItem": {
      "forward": (inst) => inst._SubscribeWorkshopItem
    },
    "SubscribeWorkshopItemV2": {
      "forward": (inst) => inst._SubscribeWorkshopItem
    },
    "UnsubscribeWorkshopItemSync": {
      "forward": (inst) => inst._UnsubscribeWorkshopItem
    },
    "UnsubscribeWorkshopItem": {
      "forward": (inst) => inst._UnsubscribeWorkshopItem
    },
    "UnsubscribeWorkshopItemV2": {
      "forward": (inst) => inst._UnsubscribeWorkshopItem
    },
    "GetWorkshopItemStateSync": {
      "forward": (inst) => inst._GetWorkshopItemState
    },
    "GetWorkshopItemState": {
      "forward": (inst) => inst._GetWorkshopItemState
    },
    "GetWorkshopItemStateV2": {
      "forward": (inst) => inst._GetWorkshopItemState
    },
    "GetWorkshopItemInstallInfoSync": {
      "forward": (inst) => inst._GetWorkshopItemInstallInfo
    },
    "GetWorkshopItemInstallInfo": {
      "forward": (inst) => inst._GetWorkshopItemInstallInfo
    },
    "GetWorkshopItemInstallInfoV2": {
      "forward": (inst) => inst._GetWorkshopItemInstallInfo
    },
    "GetWorkshopItemDownloadInfoSync": {
      "forward": (inst) => inst._GetWorkshopItemDownloadInfo
    },
    "GetWorkshopItemDownloadInfo": {
      "forward": (inst) => inst._GetWorkshopItemDownloadInfo
    },
    "GetWorkshopItemDownloadInfoV2": {
      "forward": (inst) => inst._GetWorkshopItemDownloadInfo
    },
    "GetWorkshopItemSync": {
      "forward": (inst) => inst._GetWorkshopItem
    },
    "GetWorkshopItem": {
      "forward": (inst) => inst._GetWorkshopItem
    },
    "GetWorkshopItemV2": {
      "forward": (inst) => inst._GetWorkshopItem
    },
    "GetWorkshopItemsSync": {
      "forward": (inst) => inst._GetWorkshopItems
    },
    "GetWorkshopItems": {
      "forward": (inst) => inst._GetWorkshopItems
    },
    "GetWorkshopItemsV2": {
      "forward": (inst) => inst._GetWorkshopItems
    },
    "GetSubscribedWorkshopItemsSync": {
      "forward": (inst) => inst._GetSubscribedWorkshopItems
    },
    "GetSubscribedWorkshopItems": {
      "forward": (inst) => inst._GetSubscribedWorkshopItems
    },
    "GetSubscribedWorkshopItemsV2": {
      "forward": (inst) => inst._GetSubscribedWorkshopItems
    },
    "GetWorkshopItemWithMetadataSync": {
      "forward": (inst) => inst._GetWorkshopItemWithMetadata
    },
    "GetWorkshopItemWithMetadata": {
      "forward": (inst) => inst._GetWorkshopItemWithMetadata
    },
    "GetWorkshopItemWithMetadataV2": {
      "forward": (inst) => inst._GetWorkshopItemWithMetadata
    },
    "GetWorkshopItemsWithMetadataSync": {
      "forward": (inst) => inst._GetWorkshopItemsWithMetadata
    },
    "GetWorkshopItemsWithMetadata": {
      "forward": (inst) => inst._GetWorkshopItemsWithMetadata
    },
    "GetWorkshopItemsWithMetadataV2": {
      "forward": (inst) => inst._GetWorkshopItemsWithMetadata
    },
    "GetFriendsSync": {
      "forward": (inst) => inst._GetFriends
    },
    "GetFriends": {
      "forward": (inst) => inst._GetFriends
    },
    "GetFriendsV2": {
      "forward": (inst) => inst._GetFriends
    },
    "GetFriendNameSync": {
      "forward": (inst) => inst._GetFriendName
    },
    "GetFriendName": {
      "forward": (inst) => inst._GetFriendName
    },
    "GetFriendNameV2": {
      "forward": (inst) => inst._GetFriendName
    }
  },
  Cnds: {
    "OnInitializeSuccess": {
      "forward": (inst) => inst._OnInitializeSuccess
    },
    "OnAnyInitializeSuccess": {
      "forward": (inst) => inst._OnAnyInitializeSuccess
    },
    "OnInitializeError": {
      "forward": (inst) => inst._OnInitializeError
    },
    "OnAnyInitializeError": {
      "forward": (inst) => inst._OnAnyInitializeError
    },
    "OnAppendFileSuccess": {
      "forward": (inst) => inst._OnAppendFileSuccess
    },
    "OnAnyAppendFileSuccess": {
      "forward": (inst) => inst._OnAnyAppendFileSuccess
    },
    "OnAppendFileError": {
      "forward": (inst) => inst._OnAppendFileError
    },
    "OnAnyAppendFileError": {
      "forward": (inst) => inst._OnAnyAppendFileError
    },
    "OnCopyFileSuccess": {
      "forward": (inst) => inst._OnCopyFileSuccess
    },
    "OnAnyCopyFileSuccess": {
      "forward": (inst) => inst._OnAnyCopyFileSuccess
    },
    "OnCopyFileError": {
      "forward": (inst) => inst._OnCopyFileError
    },
    "OnAnyCopyFileError": {
      "forward": (inst) => inst._OnAnyCopyFileError
    },
    "OnFetchFileSizeSuccess": {
      "forward": (inst) => inst._OnFetchFileSizeSuccess
    },
    "OnAnyFetchFileSizeSuccess": {
      "forward": (inst) => inst._OnAnyFetchFileSizeSuccess
    },
    "OnFetchFileSizeError": {
      "forward": (inst) => inst._OnFetchFileSizeError
    },
    "OnAnyFetchFileSizeError": {
      "forward": (inst) => inst._OnAnyFetchFileSizeError
    },
    "OnCreateFolderSuccess": {
      "forward": (inst) => inst._OnCreateFolderSuccess
    },
    "OnAnyCreateFolderSuccess": {
      "forward": (inst) => inst._OnAnyCreateFolderSuccess
    },
    "OnCreateFolderError": {
      "forward": (inst) => inst._OnCreateFolderError
    },
    "OnAnyCreateFolderError": {
      "forward": (inst) => inst._OnAnyCreateFolderError
    },
    "OnDeleteFileSuccess": {
      "forward": (inst) => inst._OnDeleteFileSuccess
    },
    "OnAnyDeleteFileSuccess": {
      "forward": (inst) => inst._OnAnyDeleteFileSuccess
    },
    "OnDeleteFileError": {
      "forward": (inst) => inst._OnDeleteFileError
    },
    "OnAnyDeleteFileError": {
      "forward": (inst) => inst._OnAnyDeleteFileError
    },
    "OnListFilesSuccess": {
      "forward": (inst) => inst._OnListFilesSuccess
    },
    "OnAnyListFilesSuccess": {
      "forward": (inst) => inst._OnAnyListFilesSuccess
    },
    "OnListFilesError": {
      "forward": (inst) => inst._OnListFilesError
    },
    "OnAnyListFilesError": {
      "forward": (inst) => inst._OnAnyListFilesError
    },
    "OnMoveFileSuccess": {
      "forward": (inst) => inst._OnMoveFileSuccess
    },
    "OnAnyMoveFileSuccess": {
      "forward": (inst) => inst._OnAnyMoveFileSuccess
    },
    "OnMoveFileError": {
      "forward": (inst) => inst._OnMoveFileError
    },
    "OnAnyMoveFileError": {
      "forward": (inst) => inst._OnAnyMoveFileError
    },
    "OnOpenBrowserSuccess": {
      "forward": (inst) => inst._OnOpenBrowserSuccess
    },
    "OnAnyOpenBrowserSuccess": {
      "forward": (inst) => inst._OnAnyOpenBrowserSuccess
    },
    "OnOpenBrowserError": {
      "forward": (inst) => inst._OnOpenBrowserError
    },
    "OnAnyOpenBrowserError": {
      "forward": (inst) => inst._OnAnyOpenBrowserError
    },
    "OnReadBinaryFileSuccess": {
      "forward": (inst) => inst._OnReadBinaryFileSuccess
    },
    "OnAnyReadBinaryFileSuccess": {
      "forward": (inst) => inst._OnAnyReadBinaryFileSuccess
    },
    "OnReadBinaryFileError": {
      "forward": (inst) => inst._OnReadBinaryFileError
    },
    "OnAnyReadBinaryFileError": {
      "forward": (inst) => inst._OnAnyReadBinaryFileError
    },
    "OnRenameFileSuccess": {
      "forward": (inst) => inst._OnRenameFileSuccess
    },
    "OnAnyRenameFileSuccess": {
      "forward": (inst) => inst._OnAnyRenameFileSuccess
    },
    "OnRenameFileError": {
      "forward": (inst) => inst._OnRenameFileError
    },
    "OnAnyRenameFileError": {
      "forward": (inst) => inst._OnAnyRenameFileError
    },
    "OnRunFileSuccess": {
      "forward": (inst) => inst._OnRunFileSuccess
    },
    "OnAnyRunFileSuccess": {
      "forward": (inst) => inst._OnAnyRunFileSuccess
    },
    "OnRunFileError": {
      "forward": (inst) => inst._OnRunFileError
    },
    "OnAnyRunFileError": {
      "forward": (inst) => inst._OnAnyRunFileError
    },
    "OnShellOpenSuccess": {
      "forward": (inst) => inst._OnShellOpenSuccess
    },
    "OnAnyShellOpenSuccess": {
      "forward": (inst) => inst._OnAnyShellOpenSuccess
    },
    "OnShellOpenError": {
      "forward": (inst) => inst._OnShellOpenError
    },
    "OnAnyShellOpenError": {
      "forward": (inst) => inst._OnAnyShellOpenError
    },
    "OnExplorerOpenSuccess": {
      "forward": (inst) => inst._OnExplorerOpenSuccess
    },
    "OnAnyExplorerOpenSuccess": {
      "forward": (inst) => inst._OnAnyExplorerOpenSuccess
    },
    "OnExplorerOpenError": {
      "forward": (inst) => inst._OnExplorerOpenError
    },
    "OnAnyExplorerOpenError": {
      "forward": (inst) => inst._OnAnyExplorerOpenError
    },
    "OnWriteBinaryFileSuccess": {
      "forward": (inst) => inst._OnWriteBinaryFileSuccess
    },
    "OnAnyWriteBinaryFileSuccess": {
      "forward": (inst) => inst._OnAnyWriteBinaryFileSuccess
    },
    "OnWriteBinaryFileError": {
      "forward": (inst) => inst._OnWriteBinaryFileError
    },
    "OnAnyWriteBinaryFileError": {
      "forward": (inst) => inst._OnAnyWriteBinaryFileError
    },
    "OnWriteTextFileSuccess": {
      "forward": (inst) => inst._OnWriteTextFileSuccess
    },
    "OnAnyWriteTextFileSuccess": {
      "forward": (inst) => inst._OnAnyWriteTextFileSuccess
    },
    "OnWriteTextFileError": {
      "forward": (inst) => inst._OnWriteTextFileError
    },
    "OnAnyWriteTextFileError": {
      "forward": (inst) => inst._OnAnyWriteTextFileError
    },
    "OnWriteTextSuccess": {
      "forward": (inst) => inst._OnWriteTextSuccess
    },
    "OnAnyWriteTextSuccess": {
      "forward": (inst) => inst._OnAnyWriteTextSuccess
    },
    "OnWriteTextError": {
      "forward": (inst) => inst._OnWriteTextError
    },
    "OnAnyWriteTextError": {
      "forward": (inst) => inst._OnAnyWriteTextError
    },
    "OnReadTextFileSuccess": {
      "forward": (inst) => inst._OnReadTextFileSuccess
    },
    "OnAnyReadTextFileSuccess": {
      "forward": (inst) => inst._OnAnyReadTextFileSuccess
    },
    "OnReadTextFileError": {
      "forward": (inst) => inst._OnReadTextFileError
    },
    "OnAnyReadTextFileError": {
      "forward": (inst) => inst._OnAnyReadTextFileError
    },
    "OnCheckIfPathExistSuccess": {
      "forward": (inst) => inst._OnCheckIfPathExistSuccess
    },
    "OnAnyCheckIfPathExistSuccess": {
      "forward": (inst) => inst._OnAnyCheckIfPathExistSuccess
    },
    "OnCheckIfPathExistError": {
      "forward": (inst) => inst._OnCheckIfPathExistError
    },
    "OnAnyCheckIfPathExistError": {
      "forward": (inst) => inst._OnAnyCheckIfPathExistError
    },
    "OnShowFolderDialogSuccess": {
      "forward": (inst) => inst._OnShowFolderDialogSuccess
    },
    "OnAnyShowFolderDialogSuccess": {
      "forward": (inst) => inst._OnAnyShowFolderDialogSuccess
    },
    "OnShowFolderDialogError": {
      "forward": (inst) => inst._OnShowFolderDialogError
    },
    "OnAnyShowFolderDialogError": {
      "forward": (inst) => inst._OnAnyShowFolderDialogError
    },
    "OnShowOpenDialogSuccess": {
      "forward": (inst) => inst._OnShowOpenDialogSuccess
    },
    "OnAnyShowOpenDialogSuccess": {
      "forward": (inst) => inst._OnAnyShowOpenDialogSuccess
    },
    "OnShowOpenDialogError": {
      "forward": (inst) => inst._OnShowOpenDialogError
    },
    "OnAnyShowOpenDialogError": {
      "forward": (inst) => inst._OnAnyShowOpenDialogError
    },
    "OnShowSaveDialogSuccess": {
      "forward": (inst) => inst._OnShowSaveDialogSuccess
    },
    "OnAnyShowSaveDialogSuccess": {
      "forward": (inst) => inst._OnAnyShowSaveDialogSuccess
    },
    "OnShowSaveDialogError": {
      "forward": (inst) => inst._OnShowSaveDialogError
    },
    "OnAnyShowSaveDialogError": {
      "forward": (inst) => inst._OnAnyShowSaveDialogError
    },
    "OnMaximizeSuccess": {
      "forward": (inst) => inst._OnMaximizeSuccess
    },
    "OnAnyMaximizeSuccess": {
      "forward": (inst) => inst._OnAnyMaximizeSuccess
    },
    "OnMaximizeError": {
      "forward": (inst) => inst._OnMaximizeError
    },
    "OnAnyMaximizeError": {
      "forward": (inst) => inst._OnAnyMaximizeError
    },
    "OnMinimizeSuccess": {
      "forward": (inst) => inst._OnMinimizeSuccess
    },
    "OnAnyMinimizeSuccess": {
      "forward": (inst) => inst._OnAnyMinimizeSuccess
    },
    "OnMinimizeError": {
      "forward": (inst) => inst._OnMinimizeError
    },
    "OnAnyMinimizeError": {
      "forward": (inst) => inst._OnAnyMinimizeError
    },
    "OnRestoreSuccess": {
      "forward": (inst) => inst._OnRestoreSuccess
    },
    "OnAnyRestoreSuccess": {
      "forward": (inst) => inst._OnAnyRestoreSuccess
    },
    "OnRestoreError": {
      "forward": (inst) => inst._OnRestoreError
    },
    "OnAnyRestoreError": {
      "forward": (inst) => inst._OnAnyRestoreError
    },
    "OnRequestAttentionSuccess": {
      "forward": (inst) => inst._OnRequestAttentionSuccess
    },
    "OnAnyRequestAttentionSuccess": {
      "forward": (inst) => inst._OnAnyRequestAttentionSuccess
    },
    "OnRequestAttentionError": {
      "forward": (inst) => inst._OnRequestAttentionError
    },
    "OnAnyRequestAttentionError": {
      "forward": (inst) => inst._OnAnyRequestAttentionError
    },
    "OnSetAlwaysOnTopSuccess": {
      "forward": (inst) => inst._OnSetAlwaysOnTopSuccess
    },
    "OnAnySetAlwaysOnTopSuccess": {
      "forward": (inst) => inst._OnAnySetAlwaysOnTopSuccess
    },
    "OnSetAlwaysOnTopError": {
      "forward": (inst) => inst._OnSetAlwaysOnTopError
    },
    "OnAnySetAlwaysOnTopError": {
      "forward": (inst) => inst._OnAnySetAlwaysOnTopError
    },
    "OnSetHeightSuccess": {
      "forward": (inst) => inst._OnSetHeightSuccess
    },
    "OnAnySetHeightSuccess": {
      "forward": (inst) => inst._OnAnySetHeightSuccess
    },
    "OnSetHeightError": {
      "forward": (inst) => inst._OnSetHeightError
    },
    "OnAnySetHeightError": {
      "forward": (inst) => inst._OnAnySetHeightError
    },
    "OnSetMaximumSizeSuccess": {
      "forward": (inst) => inst._OnSetMaximumSizeSuccess
    },
    "OnAnySetMaximumSizeSuccess": {
      "forward": (inst) => inst._OnAnySetMaximumSizeSuccess
    },
    "OnSetMaximumSizeError": {
      "forward": (inst) => inst._OnSetMaximumSizeError
    },
    "OnAnySetMaximumSizeError": {
      "forward": (inst) => inst._OnAnySetMaximumSizeError
    },
    "OnSetMinimumSizeSuccess": {
      "forward": (inst) => inst._OnSetMinimumSizeSuccess
    },
    "OnAnySetMinimumSizeSuccess": {
      "forward": (inst) => inst._OnAnySetMinimumSizeSuccess
    },
    "OnSetMinimumSizeError": {
      "forward": (inst) => inst._OnSetMinimumSizeError
    },
    "OnAnySetMinimumSizeError": {
      "forward": (inst) => inst._OnAnySetMinimumSizeError
    },
    "OnSetResizableSuccess": {
      "forward": (inst) => inst._OnSetResizableSuccess
    },
    "OnAnySetResizableSuccess": {
      "forward": (inst) => inst._OnAnySetResizableSuccess
    },
    "OnSetResizableError": {
      "forward": (inst) => inst._OnSetResizableError
    },
    "OnAnySetResizableError": {
      "forward": (inst) => inst._OnAnySetResizableError
    },
    "OnSetTitleSuccess": {
      "forward": (inst) => inst._OnSetTitleSuccess
    },
    "OnAnySetTitleSuccess": {
      "forward": (inst) => inst._OnAnySetTitleSuccess
    },
    "OnSetTitleError": {
      "forward": (inst) => inst._OnSetTitleError
    },
    "OnAnySetTitleError": {
      "forward": (inst) => inst._OnAnySetTitleError
    },
    "OnSetWidthSuccess": {
      "forward": (inst) => inst._OnSetWidthSuccess
    },
    "OnAnySetWidthSuccess": {
      "forward": (inst) => inst._OnAnySetWidthSuccess
    },
    "OnSetWidthError": {
      "forward": (inst) => inst._OnSetWidthError
    },
    "OnAnySetWidthError": {
      "forward": (inst) => inst._OnAnySetWidthError
    },
    "OnSetXSuccess": {
      "forward": (inst) => inst._OnSetXSuccess
    },
    "OnAnySetXSuccess": {
      "forward": (inst) => inst._OnAnySetXSuccess
    },
    "OnSetXError": {
      "forward": (inst) => inst._OnSetXError
    },
    "OnAnySetXError": {
      "forward": (inst) => inst._OnAnySetXError
    },
    "OnSetYSuccess": {
      "forward": (inst) => inst._OnSetYSuccess
    },
    "OnAnySetYSuccess": {
      "forward": (inst) => inst._OnAnySetYSuccess
    },
    "OnSetYError": {
      "forward": (inst) => inst._OnSetYError
    },
    "OnAnySetYError": {
      "forward": (inst) => inst._OnAnySetYError
    },
    "OnShowDevToolsSuccess": {
      "forward": (inst) => inst._OnShowDevToolsSuccess
    },
    "OnAnyShowDevToolsSuccess": {
      "forward": (inst) => inst._OnAnyShowDevToolsSuccess
    },
    "OnShowDevToolsError": {
      "forward": (inst) => inst._OnShowDevToolsError
    },
    "OnAnyShowDevToolsError": {
      "forward": (inst) => inst._OnAnyShowDevToolsError
    },
    "OnUnmaximizeSuccess": {
      "forward": (inst) => inst._OnUnmaximizeSuccess
    },
    "OnAnyUnmaximizeSuccess": {
      "forward": (inst) => inst._OnAnyUnmaximizeSuccess
    },
    "OnUnmaximizeError": {
      "forward": (inst) => inst._OnUnmaximizeError
    },
    "OnAnyUnmaximizeError": {
      "forward": (inst) => inst._OnAnyUnmaximizeError
    },
    "OnSetFullscreenSuccess": {
      "forward": (inst) => inst._OnSetFullscreenSuccess
    },
    "OnAnySetFullscreenSuccess": {
      "forward": (inst) => inst._OnAnySetFullscreenSuccess
    },
    "OnSetFullscreenError": {
      "forward": (inst) => inst._OnSetFullscreenError
    },
    "OnAnySetFullscreenError": {
      "forward": (inst) => inst._OnAnySetFullscreenError
    },
    "OnActivateAchievementSuccess": {
      "forward": (inst) => inst._OnActivateAchievementSuccess
    },
    "OnAnyActivateAchievementSuccess": {
      "forward": (inst) => inst._OnAnyActivateAchievementSuccess
    },
    "OnActivateAchievementError": {
      "forward": (inst) => inst._OnActivateAchievementError
    },
    "OnAnyActivateAchievementError": {
      "forward": (inst) => inst._OnAnyActivateAchievementError
    },
    "OnClearAchievementSuccess": {
      "forward": (inst) => inst._OnClearAchievementSuccess
    },
    "OnAnyClearAchievementSuccess": {
      "forward": (inst) => inst._OnAnyClearAchievementSuccess
    },
    "OnClearAchievementError": {
      "forward": (inst) => inst._OnClearAchievementError
    },
    "OnAnyClearAchievementError": {
      "forward": (inst) => inst._OnAnyClearAchievementError
    },
    "OnCheckAchievementActivationStateSuccess": {
      "forward": (inst) => inst._OnCheckAchievementActivationStateSuccess
    },
    "OnAnyCheckAchievementActivationStateSuccess": {
      "forward": (inst) => inst._OnAnyCheckAchievementActivationStateSuccess
    },
    "OnCheckAchievementActivationStateError": {
      "forward": (inst) => inst._OnCheckAchievementActivationStateError
    },
    "OnAnyCheckAchievementActivationStateError": {
      "forward": (inst) => inst._OnAnyCheckAchievementActivationStateError
    },
    "OnSetRichPresenceSuccess": {
      "forward": (inst) => inst._OnSetRichPresenceSuccess
    },
    "OnAnySetRichPresenceSuccess": {
      "forward": (inst) => inst._OnAnySetRichPresenceSuccess
    },
    "OnSetRichPresenceError": {
      "forward": (inst) => inst._OnSetRichPresenceError
    },
    "OnAnySetRichPresenceError": {
      "forward": (inst) => inst._OnAnySetRichPresenceError
    },
    "OnDiscordSetActivitySuccess": {
      "forward": (inst) => inst._OnDiscordSetActivitySuccess
    },
    "OnAnyDiscordSetActivitySuccess": {
      "forward": (inst) => inst._OnAnyDiscordSetActivitySuccess
    },
    "OnDiscordSetActivityError": {
      "forward": (inst) => inst._OnDiscordSetActivityError
    },
    "OnAnyDiscordSetActivityError": {
      "forward": (inst) => inst._OnAnyDiscordSetActivityError
    },
    "OnLeaderboardUploadScoreSuccess": {
      "forward": (inst) => inst._OnLeaderboardUploadScoreSuccess
    },
    "OnAnyLeaderboardUploadScoreSuccess": {
      "forward": (inst) => inst._OnAnyLeaderboardUploadScoreSuccess
    },
    "OnLeaderboardUploadScoreError": {
      "forward": (inst) => inst._OnLeaderboardUploadScoreError
    },
    "OnAnyLeaderboardUploadScoreError": {
      "forward": (inst) => inst._OnAnyLeaderboardUploadScoreError
    },
    "OnLeaderboardUploadScoreWithMetadataSuccess": {
      "forward": (inst) => inst._OnLeaderboardUploadScoreWithMetadataSuccess
    },
    "OnAnyLeaderboardUploadScoreWithMetadataSuccess": {
      "forward": (inst) => inst._OnAnyLeaderboardUploadScoreWithMetadataSuccess
    },
    "OnLeaderboardUploadScoreWithMetadataError": {
      "forward": (inst) => inst._OnLeaderboardUploadScoreWithMetadataError
    },
    "OnAnyLeaderboardUploadScoreWithMetadataError": {
      "forward": (inst) => inst._OnAnyLeaderboardUploadScoreWithMetadataError
    },
    "OnLeaderboardDownloadScoreSuccess": {
      "forward": (inst) => inst._OnLeaderboardDownloadScoreSuccess
    },
    "OnAnyLeaderboardDownloadScoreSuccess": {
      "forward": (inst) => inst._OnAnyLeaderboardDownloadScoreSuccess
    },
    "OnLeaderboardDownloadScoreError": {
      "forward": (inst) => inst._OnLeaderboardDownloadScoreError
    },
    "OnAnyLeaderboardDownloadScoreError": {
      "forward": (inst) => inst._OnAnyLeaderboardDownloadScoreError
    },
    "OnActivateToWebPageSuccess": {
      "forward": (inst) => inst._OnActivateToWebPageSuccess
    },
    "OnAnyActivateToWebPageSuccess": {
      "forward": (inst) => inst._OnAnyActivateToWebPageSuccess
    },
    "OnActivateToWebPageError": {
      "forward": (inst) => inst._OnActivateToWebPageError
    },
    "OnAnyActivateToWebPageError": {
      "forward": (inst) => inst._OnAnyActivateToWebPageError
    },
    "OnActivateToStoreSuccess": {
      "forward": (inst) => inst._OnActivateToStoreSuccess
    },
    "OnAnyActivateToStoreSuccess": {
      "forward": (inst) => inst._OnAnyActivateToStoreSuccess
    },
    "OnActivateToStoreError": {
      "forward": (inst) => inst._OnActivateToStoreError
    },
    "OnAnyActivateToStoreError": {
      "forward": (inst) => inst._OnAnyActivateToStoreError
    },
    "OnGetSteamUILanguageSuccess": {
      "forward": (inst) => inst._OnGetSteamUILanguageSuccess
    },
    "OnAnyGetSteamUILanguageSuccess": {
      "forward": (inst) => inst._OnAnyGetSteamUILanguageSuccess
    },
    "OnGetSteamUILanguageError": {
      "forward": (inst) => inst._OnGetSteamUILanguageError
    },
    "OnAnyGetSteamUILanguageError": {
      "forward": (inst) => inst._OnAnyGetSteamUILanguageError
    },
    "OnGetAvailableGameLanguagesSuccess": {
      "forward": (inst) => inst._OnGetAvailableGameLanguagesSuccess
    },
    "OnAnyGetAvailableGameLanguagesSuccess": {
      "forward": (inst) => inst._OnAnyGetAvailableGameLanguagesSuccess
    },
    "OnGetAvailableGameLanguagesError": {
      "forward": (inst) => inst._OnGetAvailableGameLanguagesError
    },
    "OnAnyGetAvailableGameLanguagesError": {
      "forward": (inst) => inst._OnAnyGetAvailableGameLanguagesError
    },
    "OnGetCurrentGameLanguageSuccess": {
      "forward": (inst) => inst._OnGetCurrentGameLanguageSuccess
    },
    "OnAnyGetCurrentGameLanguageSuccess": {
      "forward": (inst) => inst._OnAnyGetCurrentGameLanguageSuccess
    },
    "OnGetCurrentGameLanguageError": {
      "forward": (inst) => inst._OnGetCurrentGameLanguageError
    },
    "OnAnyGetCurrentGameLanguageError": {
      "forward": (inst) => inst._OnAnyGetCurrentGameLanguageError
    },
    "OnGetFriendsSuccess": {
      "forward": (inst) => inst._OnGetFriendsSuccess
    },
    "OnAnyGetFriendsSuccess": {
      "forward": (inst) => inst._OnAnyGetFriendsSuccess
    },
    "OnGetFriendsError": {
      "forward": (inst) => inst._OnGetFriendsError
    },
    "OnAnyGetFriendsError": {
      "forward": (inst) => inst._OnAnyGetFriendsError
    },
    "OnGetFriendNameSuccess": {
      "forward": (inst) => inst._OnGetFriendNameSuccess
    },
    "OnAnyGetFriendNameSuccess": {
      "forward": (inst) => inst._OnAnyGetFriendNameSuccess
    },
    "OnGetFriendNameError": {
      "forward": (inst) => inst._OnGetFriendNameError
    },
    "OnAnyGetFriendNameError": {
      "forward": (inst) => inst._OnAnyGetFriendNameError
    },
    "OnOverlayActivated": {
      "forward": (inst) => inst._OnOverlayActivated
    },
    "OnOverlayDeactivated": {
      "forward": (inst) => inst._OnOverlayDeactivated
    },
    "OnTriggerScreenshotSuccess": {
      "forward": (inst) => inst._OnTriggerScreenshotSuccess
    },
    "OnAnyTriggerScreenshotSuccess": {
      "forward": (inst) => inst._OnAnyTriggerScreenshotSuccess
    },
    "OnTriggerScreenshotError": {
      "forward": (inst) => inst._OnTriggerScreenshotError
    },
    "OnAnyTriggerScreenshotError": {
      "forward": (inst) => inst._OnAnyTriggerScreenshotError
    },
    "OnSaveScreenshotFromURLSuccess": {
      "forward": (inst) => inst._OnSaveScreenshotFromURLSuccess
    },
    "OnAnySaveScreenshotFromURLSuccess": {
      "forward": (inst) => inst._OnAnySaveScreenshotFromURLSuccess
    },
    "OnSaveScreenshotFromURLError": {
      "forward": (inst) => inst._OnSaveScreenshotFromURLError
    },
    "OnAnySaveScreenshotFromURLError": {
      "forward": (inst) => inst._OnAnySaveScreenshotFromURLError
    },
    "OnAddScreenshotToLibrarySuccess": {
      "forward": (inst) => inst._OnAddScreenshotToLibrarySuccess
    },
    "OnAnyAddScreenshotToLibrarySuccess": {
      "forward": (inst) => inst._OnAnyAddScreenshotToLibrarySuccess
    },
    "OnAddScreenshotToLibraryError": {
      "forward": (inst) => inst._OnAddScreenshotToLibraryError
    },
    "OnAnyAddScreenshotToLibraryError": {
      "forward": (inst) => inst._OnAnyAddScreenshotToLibraryError
    },
    "OnCheckDLCIsInstalledSuccess": {
      "forward": (inst) => inst._OnCheckDLCIsInstalledSuccess
    },
    "OnAnyCheckDLCIsInstalledSuccess": {
      "forward": (inst) => inst._OnAnyCheckDLCIsInstalledSuccess
    },
    "OnCheckDLCIsInstalledError": {
      "forward": (inst) => inst._OnCheckDLCIsInstalledError
    },
    "OnAnyCheckDLCIsInstalledError": {
      "forward": (inst) => inst._OnAnyCheckDLCIsInstalledError
    },
    "OnShowGamepadTextInputSuccess": {
      "forward": (inst) => inst._OnShowGamepadTextInputSuccess
    },
    "OnAnyShowGamepadTextInputSuccess": {
      "forward": (inst) => inst._OnAnyShowGamepadTextInputSuccess
    },
    "OnShowGamepadTextInputError": {
      "forward": (inst) => inst._OnShowGamepadTextInputError
    },
    "OnAnyShowGamepadTextInputError": {
      "forward": (inst) => inst._OnAnyShowGamepadTextInputError
    },
    "OnShowFloatingGamepadTextInputSuccess": {
      "forward": (inst) => inst._OnShowFloatingGamepadTextInputSuccess
    },
    "OnAnyShowFloatingGamepadTextInputSuccess": {
      "forward": (inst) => inst._OnAnyShowFloatingGamepadTextInputSuccess
    },
    "OnShowFloatingGamepadTextInputError": {
      "forward": (inst) => inst._OnShowFloatingGamepadTextInputError
    },
    "OnAnyShowFloatingGamepadTextInputError": {
      "forward": (inst) => inst._OnAnyShowFloatingGamepadTextInputError
    },
    "OnCreateWorkshopItemSuccess": {
      "forward": (inst) => inst._OnCreateWorkshopItemSuccess
    },
    "OnAnyCreateWorkshopItemSuccess": {
      "forward": (inst) => inst._OnAnyCreateWorkshopItemSuccess
    },
    "OnCreateWorkshopItemError": {
      "forward": (inst) => inst._OnCreateWorkshopItemError
    },
    "OnAnyCreateWorkshopItemError": {
      "forward": (inst) => inst._OnAnyCreateWorkshopItemError
    },
    "OnUpdateWorkshopItemSuccess": {
      "forward": (inst) => inst._OnUpdateWorkshopItemSuccess
    },
    "OnAnyUpdateWorkshopItemSuccess": {
      "forward": (inst) => inst._OnAnyUpdateWorkshopItemSuccess
    },
    "OnUpdateWorkshopItemError": {
      "forward": (inst) => inst._OnUpdateWorkshopItemError
    },
    "OnAnyUpdateWorkshopItemError": {
      "forward": (inst) => inst._OnAnyUpdateWorkshopItemError
    },
    "OnGetSubscribedItemsWithMetadataSuccess": {
      "forward": (inst) => inst._OnGetSubscribedItemsWithMetadataSuccess
    },
    "OnAnyGetSubscribedItemsWithMetadataSuccess": {
      "forward": (inst) => inst._OnAnyGetSubscribedItemsWithMetadataSuccess
    },
    "OnGetSubscribedItemsWithMetadataError": {
      "forward": (inst) => inst._OnGetSubscribedItemsWithMetadataError
    },
    "OnAnyGetSubscribedItemsWithMetadataError": {
      "forward": (inst) => inst._OnAnyGetSubscribedItemsWithMetadataError
    },
    "OnDownloadWorkshopItemSuccess": {
      "forward": (inst) => inst._OnDownloadWorkshopItemSuccess
    },
    "OnAnyDownloadWorkshopItemSuccess": {
      "forward": (inst) => inst._OnAnyDownloadWorkshopItemSuccess
    },
    "OnDownloadWorkshopItemError": {
      "forward": (inst) => inst._OnDownloadWorkshopItemError
    },
    "OnAnyDownloadWorkshopItemError": {
      "forward": (inst) => inst._OnAnyDownloadWorkshopItemError
    },
    "OnDeleteWorkshopItemSuccess": {
      "forward": (inst) => inst._OnDeleteWorkshopItemSuccess
    },
    "OnAnyDeleteWorkshopItemSuccess": {
      "forward": (inst) => inst._OnAnyDeleteWorkshopItemSuccess
    },
    "OnDeleteWorkshopItemError": {
      "forward": (inst) => inst._OnDeleteWorkshopItemError
    },
    "OnAnyDeleteWorkshopItemError": {
      "forward": (inst) => inst._OnAnyDeleteWorkshopItemError
    },
    "OnSubscribeWorkshopItemSuccess": {
      "forward": (inst) => inst._OnSubscribeWorkshopItemSuccess
    },
    "OnAnySubscribeWorkshopItemSuccess": {
      "forward": (inst) => inst._OnAnySubscribeWorkshopItemSuccess
    },
    "OnSubscribeWorkshopItemError": {
      "forward": (inst) => inst._OnSubscribeWorkshopItemError
    },
    "OnAnySubscribeWorkshopItemError": {
      "forward": (inst) => inst._OnAnySubscribeWorkshopItemError
    },
    "OnUnsubscribeWorkshopItemSuccess": {
      "forward": (inst) => inst._OnUnsubscribeWorkshopItemSuccess
    },
    "OnAnyUnsubscribeWorkshopItemSuccess": {
      "forward": (inst) => inst._OnAnyUnsubscribeWorkshopItemSuccess
    },
    "OnUnsubscribeWorkshopItemError": {
      "forward": (inst) => inst._OnUnsubscribeWorkshopItemError
    },
    "OnAnyUnsubscribeWorkshopItemError": {
      "forward": (inst) => inst._OnAnyUnsubscribeWorkshopItemError
    },
    "OnGetWorkshopItemStateSuccess": {
      "forward": (inst) => inst._OnGetWorkshopItemStateSuccess
    },
    "OnAnyGetWorkshopItemStateSuccess": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemStateSuccess
    },
    "OnGetWorkshopItemStateError": {
      "forward": (inst) => inst._OnGetWorkshopItemStateError
    },
    "OnAnyGetWorkshopItemStateError": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemStateError
    },
    "OnGetWorkshopItemInstallInfoSuccess": {
      "forward": (inst) => inst._OnGetWorkshopItemInstallInfoSuccess
    },
    "OnAnyGetWorkshopItemInstallInfoSuccess": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemInstallInfoSuccess
    },
    "OnGetWorkshopItemInstallInfoError": {
      "forward": (inst) => inst._OnGetWorkshopItemInstallInfoError
    },
    "OnAnyGetWorkshopItemInstallInfoError": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemInstallInfoError
    },
    "OnGetWorkshopItemDownloadInfoSuccess": {
      "forward": (inst) => inst._OnGetWorkshopItemDownloadInfoSuccess
    },
    "OnAnyGetWorkshopItemDownloadInfoSuccess": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemDownloadInfoSuccess
    },
    "OnGetWorkshopItemDownloadInfoError": {
      "forward": (inst) => inst._OnGetWorkshopItemDownloadInfoError
    },
    "OnAnyGetWorkshopItemDownloadInfoError": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemDownloadInfoError
    },
    "OnGetWorkshopItemSuccess": {
      "forward": (inst) => inst._OnGetWorkshopItemSuccess
    },
    "OnAnyGetWorkshopItemSuccess": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemSuccess
    },
    "OnGetWorkshopItemError": {
      "forward": (inst) => inst._OnGetWorkshopItemError
    },
    "OnAnyGetWorkshopItemError": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemError
    },
    "OnGetWorkshopItemsSuccess": {
      "forward": (inst) => inst._OnGetWorkshopItemsSuccess
    },
    "OnAnyGetWorkshopItemsSuccess": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemsSuccess
    },
    "OnGetWorkshopItemsError": {
      "forward": (inst) => inst._OnGetWorkshopItemsError
    },
    "OnAnyGetWorkshopItemsError": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemsError
    },
    "OnGetSubscribedWorkshopItemsSuccess": {
      "forward": (inst) => inst._OnGetSubscribedWorkshopItemsSuccess
    },
    "OnAnyGetSubscribedWorkshopItemsSuccess": {
      "forward": (inst) => inst._OnAnyGetSubscribedWorkshopItemsSuccess
    },
    "OnGetSubscribedWorkshopItemsError": {
      "forward": (inst) => inst._OnGetSubscribedWorkshopItemsError
    },
    "OnAnyGetSubscribedWorkshopItemsError": {
      "forward": (inst) => inst._OnAnyGetSubscribedWorkshopItemsError
    },
    "OnGetWorkshopItemWithMetadataSuccess": {
      "forward": (inst) => inst._OnGetWorkshopItemWithMetadataSuccess
    },
    "OnAnyGetWorkshopItemWithMetadataSuccess": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemWithMetadataSuccess
    },
    "OnGetWorkshopItemWithMetadataError": {
      "forward": (inst) => inst._OnGetWorkshopItemWithMetadataError
    },
    "OnAnyGetWorkshopItemWithMetadataError": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemWithMetadataError
    },
    "OnGetWorkshopItemsWithMetadataSuccess": {
      "forward": (inst) => inst._OnGetWorkshopItemsWithMetadataSuccess
    },
    "OnAnyGetWorkshopItemsWithMetadataSuccess": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemsWithMetadataSuccess
    },
    "OnGetWorkshopItemsWithMetadataError": {
      "forward": (inst) => inst._OnGetWorkshopItemsWithMetadataError
    },
    "OnAnyGetWorkshopItemsWithMetadataError": {
      "forward": (inst) => inst._OnAnyGetWorkshopItemsWithMetadataError
    },
    "IsEngine": {
      "forward": (inst) => inst._IsEngine
    },
    "IsPipelab": {
      "forward": (inst) => inst._IsPipelab
    },
    "IsInitialized": {
      "forward": (inst) => inst._IsInitialized
    },
    "IsFullScreen": {
      "forward": (inst) => inst._IsFullScreen
    },
    "LastCheckedPathExists": {
      "forward": (inst) => inst._LastCheckedPathExists
    },
    "IsOverlayActive": {
      "forward": (inst) => inst._IsOverlayActive
    }
  },
  Exps: {
    "InitializeError": {
      "forward": (inst) => inst._InitializeError
    },
    "InitializeResult": {
      "forward": (inst) => inst._InitializeResult
    },
    "AppendFileError": {
      "forward": (inst) => inst._AppendFileError
    },
    "AppendFileResult": {
      "forward": (inst) => inst._AppendFileResult
    },
    "CopyFileError": {
      "forward": (inst) => inst._CopyFileError
    },
    "CopyFileResult": {
      "forward": (inst) => inst._CopyFileResult
    },
    "FetchFileSizeError": {
      "forward": (inst) => inst._FetchFileSizeError
    },
    "FetchFileSizeResult": {
      "forward": (inst) => inst._FetchFileSizeResult
    },
    "CreateFolderError": {
      "forward": (inst) => inst._CreateFolderError
    },
    "CreateFolderResult": {
      "forward": (inst) => inst._CreateFolderResult
    },
    "DeleteFileError": {
      "forward": (inst) => inst._DeleteFileError
    },
    "DeleteFileResult": {
      "forward": (inst) => inst._DeleteFileResult
    },
    "ListFilesError": {
      "forward": (inst) => inst._ListFilesError
    },
    "ListFilesResult": {
      "forward": (inst) => inst._ListFilesResult
    },
    "MoveFileError": {
      "forward": (inst) => inst._MoveFileError
    },
    "MoveFileResult": {
      "forward": (inst) => inst._MoveFileResult
    },
    "OpenBrowserError": {
      "forward": (inst) => inst._OpenBrowserError
    },
    "OpenBrowserResult": {
      "forward": (inst) => inst._OpenBrowserResult
    },
    "ReadBinaryFileError": {
      "forward": (inst) => inst._ReadBinaryFileError
    },
    "ReadBinaryFileResult": {
      "forward": (inst) => inst._ReadBinaryFileResult
    },
    "RenameFileError": {
      "forward": (inst) => inst._RenameFileError
    },
    "RenameFileResult": {
      "forward": (inst) => inst._RenameFileResult
    },
    "RunFileError": {
      "forward": (inst) => inst._RunFileError
    },
    "RunFileResult": {
      "forward": (inst) => inst._RunFileResult
    },
    "ShellOpenError": {
      "forward": (inst) => inst._ShellOpenError
    },
    "ShellOpenResult": {
      "forward": (inst) => inst._ShellOpenResult
    },
    "ExplorerOpenError": {
      "forward": (inst) => inst._ExplorerOpenError
    },
    "ExplorerOpenResult": {
      "forward": (inst) => inst._ExplorerOpenResult
    },
    "WriteBinaryFileError": {
      "forward": (inst) => inst._WriteBinaryFileError
    },
    "WriteBinaryFileResult": {
      "forward": (inst) => inst._WriteBinaryFileResult
    },
    "WriteTextFileError": {
      "forward": (inst) => inst._WriteTextFileError
    },
    "WriteTextFileResult": {
      "forward": (inst) => inst._WriteTextFileResult
    },
    "WriteTextError": {
      "forward": (inst) => inst._WriteTextError
    },
    "WriteTextResult": {
      "forward": (inst) => inst._WriteTextResult
    },
    "ReadTextFileError": {
      "forward": (inst) => inst._ReadTextFileError
    },
    "ReadTextFileResult": {
      "forward": (inst) => inst._ReadTextFileResult
    },
    "CheckIfPathExistError": {
      "forward": (inst) => inst._CheckIfPathExistError
    },
    "CheckIfPathExistResult": {
      "forward": (inst) => inst._CheckIfPathExistResult
    },
    "ShowFolderDialogError": {
      "forward": (inst) => inst._ShowFolderDialogError
    },
    "ShowFolderDialogResult": {
      "forward": (inst) => inst._ShowFolderDialogResult
    },
    "ShowOpenDialogError": {
      "forward": (inst) => inst._ShowOpenDialogError
    },
    "ShowOpenDialogResult": {
      "forward": (inst) => inst._ShowOpenDialogResult
    },
    "ShowSaveDialogError": {
      "forward": (inst) => inst._ShowSaveDialogError
    },
    "ShowSaveDialogResult": {
      "forward": (inst) => inst._ShowSaveDialogResult
    },
    "MaximizeError": {
      "forward": (inst) => inst._MaximizeError
    },
    "MaximizeResult": {
      "forward": (inst) => inst._MaximizeResult
    },
    "MinimizeError": {
      "forward": (inst) => inst._MinimizeError
    },
    "MinimizeResult": {
      "forward": (inst) => inst._MinimizeResult
    },
    "RestoreError": {
      "forward": (inst) => inst._RestoreError
    },
    "RestoreResult": {
      "forward": (inst) => inst._RestoreResult
    },
    "RequestAttentionError": {
      "forward": (inst) => inst._RequestAttentionError
    },
    "RequestAttentionResult": {
      "forward": (inst) => inst._RequestAttentionResult
    },
    "SetAlwaysOnTopError": {
      "forward": (inst) => inst._SetAlwaysOnTopError
    },
    "SetAlwaysOnTopResult": {
      "forward": (inst) => inst._SetAlwaysOnTopResult
    },
    "SetHeightError": {
      "forward": (inst) => inst._SetHeightError
    },
    "SetHeightResult": {
      "forward": (inst) => inst._SetHeightResult
    },
    "SetMaximumSizeError": {
      "forward": (inst) => inst._SetMaximumSizeError
    },
    "SetMaximumSizeResult": {
      "forward": (inst) => inst._SetMaximumSizeResult
    },
    "SetMinimumSizeError": {
      "forward": (inst) => inst._SetMinimumSizeError
    },
    "SetMinimumSizeResult": {
      "forward": (inst) => inst._SetMinimumSizeResult
    },
    "SetResizableError": {
      "forward": (inst) => inst._SetResizableError
    },
    "SetResizableResult": {
      "forward": (inst) => inst._SetResizableResult
    },
    "SetTitleError": {
      "forward": (inst) => inst._SetTitleError
    },
    "SetTitleResult": {
      "forward": (inst) => inst._SetTitleResult
    },
    "SetWidthError": {
      "forward": (inst) => inst._SetWidthError
    },
    "SetWidthResult": {
      "forward": (inst) => inst._SetWidthResult
    },
    "SetXError": {
      "forward": (inst) => inst._SetXError
    },
    "SetXResult": {
      "forward": (inst) => inst._SetXResult
    },
    "SetYError": {
      "forward": (inst) => inst._SetYError
    },
    "SetYResult": {
      "forward": (inst) => inst._SetYResult
    },
    "ShowDevToolsError": {
      "forward": (inst) => inst._ShowDevToolsError
    },
    "ShowDevToolsResult": {
      "forward": (inst) => inst._ShowDevToolsResult
    },
    "UnmaximizeError": {
      "forward": (inst) => inst._UnmaximizeError
    },
    "UnmaximizeResult": {
      "forward": (inst) => inst._UnmaximizeResult
    },
    "SetFullscreenError": {
      "forward": (inst) => inst._SetFullscreenError
    },
    "SetFullscreenResult": {
      "forward": (inst) => inst._SetFullscreenResult
    },
    "ActivateAchievementError": {
      "forward": (inst) => inst._ActivateAchievementError
    },
    "ActivateAchievementResult": {
      "forward": (inst) => inst._ActivateAchievementResult
    },
    "ClearAchievementError": {
      "forward": (inst) => inst._ClearAchievementError
    },
    "ClearAchievementResult": {
      "forward": (inst) => inst._ClearAchievementResult
    },
    "CheckAchievementActivationStateError": {
      "forward": (inst) => inst._CheckAchievementActivationStateError
    },
    "CheckAchievementActivationStateResult": {
      "forward": (inst) => inst._CheckAchievementActivationStateResult
    },
    "SetRichPresenceError": {
      "forward": (inst) => inst._SetRichPresenceError
    },
    "SetRichPresenceResult": {
      "forward": (inst) => inst._SetRichPresenceResult
    },
    "DiscordSetActivityError": {
      "forward": (inst) => inst._DiscordSetActivityError
    },
    "DiscordSetActivityResult": {
      "forward": (inst) => inst._DiscordSetActivityResult
    },
    "LeaderboardUploadScoreError": {
      "forward": (inst) => inst._LeaderboardUploadScoreError
    },
    "LeaderboardUploadScoreResult": {
      "forward": (inst) => inst._LeaderboardUploadScoreResult
    },
    "LeaderboardUploadScoreWithMetadataError": {
      "forward": (inst) => inst._LeaderboardUploadScoreWithMetadataError
    },
    "LeaderboardUploadScoreWithMetadataResult": {
      "forward": (inst) => inst._LeaderboardUploadScoreWithMetadataResult
    },
    "LeaderboardDownloadScoreError": {
      "forward": (inst) => inst._LeaderboardDownloadScoreError
    },
    "LeaderboardDownloadScoreResult": {
      "forward": (inst) => inst._LeaderboardDownloadScoreResult
    },
    "ActivateToWebPageError": {
      "forward": (inst) => inst._ActivateToWebPageError
    },
    "ActivateToWebPageResult": {
      "forward": (inst) => inst._ActivateToWebPageResult
    },
    "ActivateToStoreError": {
      "forward": (inst) => inst._ActivateToStoreError
    },
    "ActivateToStoreResult": {
      "forward": (inst) => inst._ActivateToStoreResult
    },
    "GetSteamUILanguageError": {
      "forward": (inst) => inst._GetSteamUILanguageError
    },
    "GetSteamUILanguageResult": {
      "forward": (inst) => inst._GetSteamUILanguageResult
    },
    "GetAvailableGameLanguagesError": {
      "forward": (inst) => inst._GetAvailableGameLanguagesError
    },
    "GetAvailableGameLanguagesResult": {
      "forward": (inst) => inst._GetAvailableGameLanguagesResult
    },
    "GetCurrentGameLanguageError": {
      "forward": (inst) => inst._GetCurrentGameLanguageError
    },
    "GetCurrentGameLanguageResult": {
      "forward": (inst) => inst._GetCurrentGameLanguageResult
    },
    "TriggerScreenshotError": {
      "forward": (inst) => inst._TriggerScreenshotError
    },
    "TriggerScreenshotResult": {
      "forward": (inst) => inst._TriggerScreenshotResult
    },
    "SaveScreenshotFromURLError": {
      "forward": (inst) => inst._SaveScreenshotFromURLError
    },
    "SaveScreenshotFromURLResult": {
      "forward": (inst) => inst._SaveScreenshotFromURLResult
    },
    "AddScreenshotToLibraryError": {
      "forward": (inst) => inst._AddScreenshotToLibraryError
    },
    "AddScreenshotToLibraryResult": {
      "forward": (inst) => inst._AddScreenshotToLibraryResult
    },
    "CheckDLCIsInstalledError": {
      "forward": (inst) => inst._CheckDLCIsInstalledError
    },
    "CheckDLCIsInstalledResult": {
      "forward": (inst) => inst._CheckDLCIsInstalledResult
    },
    "ShowGamepadTextInputError": {
      "forward": (inst) => inst._ShowGamepadTextInputError
    },
    "ShowGamepadTextInputResult": {
      "forward": (inst) => inst._ShowGamepadTextInputResult
    },
    "ShowFloatingGamepadTextInputError": {
      "forward": (inst) => inst._ShowFloatingGamepadTextInputError
    },
    "ShowFloatingGamepadTextInputResult": {
      "forward": (inst) => inst._ShowFloatingGamepadTextInputResult
    },
    "CreateWorkshopItemError": {
      "forward": (inst) => inst._CreateWorkshopItemError
    },
    "CreateWorkshopItemResult": {
      "forward": (inst) => inst._CreateWorkshopItemResult
    },
    "UpdateWorkshopItemError": {
      "forward": (inst) => inst._UpdateWorkshopItemError
    },
    "UpdateWorkshopItemResult": {
      "forward": (inst) => inst._UpdateWorkshopItemResult
    },
    "GetSubscribedItemsWithMetadataError": {
      "forward": (inst) => inst._GetSubscribedItemsWithMetadataError
    },
    "GetSubscribedItemsWithMetadataResult": {
      "forward": (inst) => inst._GetSubscribedItemsWithMetadataResult
    },
    "DownloadWorkshopItemError": {
      "forward": (inst) => inst._DownloadWorkshopItemError
    },
    "DownloadWorkshopItemResult": {
      "forward": (inst) => inst._DownloadWorkshopItemResult
    },
    "DeleteWorkshopItemError": {
      "forward": (inst) => inst._DeleteWorkshopItemError
    },
    "DeleteWorkshopItemResult": {
      "forward": (inst) => inst._DeleteWorkshopItemResult
    },
    "SubscribeWorkshopItemError": {
      "forward": (inst) => inst._SubscribeWorkshopItemError
    },
    "SubscribeWorkshopItemResult": {
      "forward": (inst) => inst._SubscribeWorkshopItemResult
    },
    "UnsubscribeWorkshopItemError": {
      "forward": (inst) => inst._UnsubscribeWorkshopItemError
    },
    "UnsubscribeWorkshopItemResult": {
      "forward": (inst) => inst._UnsubscribeWorkshopItemResult
    },
    "GetWorkshopItemStateError": {
      "forward": (inst) => inst._GetWorkshopItemStateError
    },
    "GetWorkshopItemStateResult": {
      "forward": (inst) => inst._GetWorkshopItemStateResult
    },
    "GetWorkshopItemInstallInfoError": {
      "forward": (inst) => inst._GetWorkshopItemInstallInfoError
    },
    "GetWorkshopItemInstallInfoResult": {
      "forward": (inst) => inst._GetWorkshopItemInstallInfoResult
    },
    "GetWorkshopItemDownloadInfoError": {
      "forward": (inst) => inst._GetWorkshopItemDownloadInfoError
    },
    "GetWorkshopItemDownloadInfoResult": {
      "forward": (inst) => inst._GetWorkshopItemDownloadInfoResult
    },
    "GetWorkshopItemError": {
      "forward": (inst) => inst._GetWorkshopItemError
    },
    "GetWorkshopItemResult": {
      "forward": (inst) => inst._GetWorkshopItemResult
    },
    "GetWorkshopItemsError": {
      "forward": (inst) => inst._GetWorkshopItemsError
    },
    "GetWorkshopItemsResult": {
      "forward": (inst) => inst._GetWorkshopItemsResult
    },
    "GetSubscribedWorkshopItemsError": {
      "forward": (inst) => inst._GetSubscribedWorkshopItemsError
    },
    "GetSubscribedWorkshopItemsResult": {
      "forward": (inst) => inst._GetSubscribedWorkshopItemsResult
    },
    "GetWorkshopItemWithMetadataError": {
      "forward": (inst) => inst._GetWorkshopItemWithMetadataError
    },
    "GetWorkshopItemWithMetadataResult": {
      "forward": (inst) => inst._GetWorkshopItemWithMetadataResult
    },
    "GetWorkshopItemsWithMetadataError": {
      "forward": (inst) => inst._GetWorkshopItemsWithMetadataError
    },
    "GetWorkshopItemsWithMetadataResult": {
      "forward": (inst) => inst._GetWorkshopItemsWithMetadataResult
    },
    "SubscribedItemsCount": {
      "forward": (inst) => inst._SubscribedItemsCount
    },
    "SubscribedItemIdAt": {
      "forward": (inst) => inst._SubscribedItemIdAt
    },
    "WorkshopItemTitle": {
      "forward": (inst) => inst._WorkshopItemTitle
    },
    "WorkshopItemDescription": {
      "forward": (inst) => inst._WorkshopItemDescription
    },
    "WorkshopItemOwnerSteamId64": {
      "forward": (inst) => inst._WorkshopItemOwnerSteamId64
    },
    "WorkshopItemOwnerAccountId": {
      "forward": (inst) => inst._WorkshopItemOwnerAccountId
    },
    "WorkshopItemTags": {
      "forward": (inst) => inst._WorkshopItemTags
    },
    "WorkshopItemUpvotes": {
      "forward": (inst) => inst._WorkshopItemUpvotes
    },
    "WorkshopItemDownvotes": {
      "forward": (inst) => inst._WorkshopItemDownvotes
    },
    "WorkshopItemPreviewUrl": {
      "forward": (inst) => inst._WorkshopItemPreviewUrl
    },
    "WorkshopItemUrl": {
      "forward": (inst) => inst._WorkshopItemUrl
    },
    "WorkshopItemTimeCreated": {
      "forward": (inst) => inst._WorkshopItemTimeCreated
    },
    "WorkshopItemTimeUpdated": {
      "forward": (inst) => inst._WorkshopItemTimeUpdated
    },
    "WorkshopItemState": {
      "forward": (inst) => inst._WorkshopItemState
    },
    "WorkshopItemIsInstalled": {
      "forward": (inst) => inst._WorkshopItemIsInstalled
    },
    "WorkshopItemIsDownloading": {
      "forward": (inst) => inst._WorkshopItemIsDownloading
    },
    "WorkshopItemNeedsUpdate": {
      "forward": (inst) => inst._WorkshopItemNeedsUpdate
    },
    "WorkshopItemInstallFolder": {
      "forward": (inst) => inst._WorkshopItemInstallFolder
    },
    "WorkshopItemSizeOnDisk": {
      "forward": (inst) => inst._WorkshopItemSizeOnDisk
    },
    "WorkshopItemTimestamp": {
      "forward": (inst) => inst._WorkshopItemTimestamp
    },
    "WorkshopItemDownloadCurrent": {
      "forward": (inst) => inst._WorkshopItemDownloadCurrent
    },
    "WorkshopItemDownloadTotal": {
      "forward": (inst) => inst._WorkshopItemDownloadTotal
    },
    "GetFriendsError": {
      "forward": (inst) => inst._GetFriendsError
    },
    "GetFriendsResult": {
      "forward": (inst) => inst._GetFriendsResult
    },
    "GetFriendNameError": {
      "forward": (inst) => inst._GetFriendNameError
    },
    "GetFriendNameResult": {
      "forward": (inst) => inst._GetFriendNameResult
    },
    "ArgumentAt": {
      "forward": (inst) => inst._ArgumentAt
    },
    "ArgumentCount": {
      "forward": (inst) => inst._ArgumentCount
    },
    "AppFolderURL": {
      "forward": (inst) => inst._AppFolderURL
    },
    "DroppedFile": {
      "forward": (inst) => inst._DroppedFile
    },
    "ListAt": {
      "forward": (inst) => inst._ListAt
    },
    "ListCount": {
      "forward": (inst) => inst._ListCount
    },
    "ProjectFilesFolder": {
      "forward": (inst) => inst._ProjectFilesFolder
    },
    "ProjectFilesFolderURL": {
      "forward": (inst) => inst._ProjectFilesFolderURL
    },
    "ReadFile": {
      "forward": (inst) => inst._ReadFile
    },
    "UserFolder": {
      "forward": (inst) => inst._UserFolder
    },
    "HomeFolder": {
      "forward": (inst) => inst._HomeFolder
    },
    "AppDataFolder": {
      "forward": (inst) => inst._AppDataFolder
    },
    "LocalAppDataFolder": {
      "forward": (inst) => inst._LocalAppDataFolder
    },
    "UserDataFolder": {
      "forward": (inst) => inst._UserDataFolder
    },
    "LocalUserDataFolder": {
      "forward": (inst) => inst._LocalUserDataFolder
    },
    "SessionDataFolder": {
      "forward": (inst) => inst._SessionDataFolder
    },
    "TempFolder": {
      "forward": (inst) => inst._TempFolder
    },
    "ExeFolder": {
      "forward": (inst) => inst._ExeFolder
    },
    "ModuleFolder": {
      "forward": (inst) => inst._ModuleFolder
    },
    "DesktopFolder": {
      "forward": (inst) => inst._DesktopFolder
    },
    "DocumentsFolder": {
      "forward": (inst) => inst._DocumentsFolder
    },
    "DownloadsFolder": {
      "forward": (inst) => inst._DownloadsFolder
    },
    "MusicFolder": {
      "forward": (inst) => inst._MusicFolder
    },
    "PicturesFolder": {
      "forward": (inst) => inst._PicturesFolder
    },
    "VideosFolder": {
      "forward": (inst) => inst._VideosFolder
    },
    "RecentFolder": {
      "forward": (inst) => inst._RecentFolder
    },
    "LogsFolder": {
      "forward": (inst) => inst._LogsFolder
    },
    "CrashDumpsFolder": {
      "forward": (inst) => inst._CrashDumpsFolder
    },
    "AppFolder": {
      "forward": (inst) => inst._AppFolder
    },
    "WindowHeight": {
      "forward": (inst) => inst._WindowHeight
    },
    "WindowWidth": {
      "forward": (inst) => inst._WindowWidth
    },
    "WindowTitle": {
      "forward": (inst) => inst._WindowTitle
    },
    "WindowX": {
      "forward": (inst) => inst._WindowX
    },
    "WindowY": {
      "forward": (inst) => inst._WindowY
    },
    "FullscreenState": {
      "forward": (inst) => inst._FullscreenState
    },
    "CurrentPlatform": {
      "forward": (inst) => inst._CurrentPlatform
    },
    "CurrentArchitecture": {
      "forward": (inst) => inst._CurrentArchitecture
    },
    "SteamAccountId": {
      "forward": (inst) => inst._SteamAccountId
    },
    "SteamId32": {
      "forward": (inst) => inst._SteamId32
    },
    "SteamId64": {
      "forward": (inst) => inst._SteamId64
    },
    "SteamUsername": {
      "forward": (inst) => inst._SteamUsername
    },
    "SteamLevel": {
      "forward": (inst) => inst._SteamLevel
    },
    "SteamIpCountry": {
      "forward": (inst) => inst._SteamIpCountry
    },
    "SteamIsRunningOnSteamDeck": {
      "forward": (inst) => inst._SteamIsRunningOnSteamDeck
    },
    "SteamAppId": {
      "forward": (inst) => inst._SteamAppId
    },
    "SteamIsOffline": {
      "forward": (inst) => inst._SteamIsOffline
    },
    "SteamIsOnline": {
      "forward": (inst) => inst._SteamIsOnline
    },
    "SteamIsBusy": {
      "forward": (inst) => inst._SteamIsBusy
    },
    "SteamIsAway": {
      "forward": (inst) => inst._SteamIsAway
    },
    "SteamIsSnooze": {
      "forward": (inst) => inst._SteamIsSnooze
    },
    "SteamIsLookingToTrade": {
      "forward": (inst) => inst._SteamIsLookingToTrade
    },
    "SteamIsLookingToPlay": {
      "forward": (inst) => inst._SteamIsLookingToPlay
    },
    "SteamIsInvisible": {
      "forward": (inst) => inst._SteamIsInvisible
    }
  }
};
var sdk = "v2";
sdk = "v2";
var camelCasedMap = /* @__PURE__ */ new Map();
function camelCasify(str) {
  if (camelCasedMap.has(str)) {
    return camelCasedMap.get(str);
  }
  let cleanedStr = str.replace(/[^a-zA-Z0-9$_]/g, " ");
  let words = cleanedStr.split(" ").filter(Boolean);
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
  }
  let result = words.join("");
  if (!isNaN(parseInt(result.charAt(0)))) {
    result = "_" + result;
  }
  camelCasedMap.set(str, result);
  return result;
}
var SDKPluginBaseVar = sdk === "v1" ? C3.SDKPluginBase : globalThis.ISDKPluginBase;
var SDKInstanceBaseVar = sdk === "v1" ? C3.SDKInstanceBase : globalThis.ISDKInstanceBase;
var SDKWorldInstanceBaseVar = sdk === "v1" ? C3.SDKWorldInstanceBase : globalThis.ISDKWorldInstanceBase;
var SDKDOMPluginBaseVar = sdk === "v1" ? C3.SDKDOMPluginBase : globalThis.ISDKDOMPluginBase;
var SDKDOMInstanceBaseVar = sdk === "v1" ? C3.SDKDOMInstanceBase : globalThis.ISDKDOMInstanceBase;
var InstanceVar = sdk === "v1" ? self.IInstance : globalThis.IInstance;
var WorldInstanceVar = sdk === "v1" ? self.IWorldInstance : globalThis.IWorldInstance;
var DOMInstanceVar = sdk === "v1" ? self.IDOMInstance : globalThis.IDOMInstance;
var parentClass = {
  object: {
    scripting: InstanceVar,
    instance: SDKInstanceBaseVar,
    plugin: SDKPluginBaseVar
  },
  world: {
    scripting: WorldInstanceVar,
    instance: SDKWorldInstanceBaseVar,
    plugin: SDKPluginBaseVar
  },
  dom: {
    scripting: DOMInstanceVar,
    instance: SDKDOMInstanceBaseVar,
    plugin: SDKDOMPluginBaseVar
  }
};
if (sdk === "v1") {
  C3.Plugins[PLUGIN_INFO.id] = class extends parentClass[PLUGIN_INFO.type].plugin {
    Release() {
      super.Release();
    }
  };
} else {
  C3.Plugins[PLUGIN_INFO.id] = class extends parentClass[PLUGIN_INFO.type].plugin {
    _release() {
      super._release();
    }
  };
}
var SDKObjectTypeBaseVar = sdk === "v1" ? C3.SDKTypeBase : globalThis.ISDKObjectTypeBase;
var P_C = C3.Plugins[PLUGIN_INFO.id];
if (sdk === "v1") {
  P_C.Type = class extends SDKObjectTypeBaseVar {
    constructor(objectClass) {
      super(objectClass);
    }
    Release() {
      super.Release();
    }
    OnCreate() {
    }
  };
} else {
  P_C.Type = class extends SDKObjectTypeBaseVar {
    constructor(objectClass) {
      super(objectClass);
    }
    _release() {
      super._release();
    }
    _onCreate() {
    }
  };
}
var addonTriggers = [];
P_C.Acts = {};
P_C.Cnds = {};
P_C.Exps = {};
Object.keys(PLUGIN_INFO.Acts).forEach((key) => {
  const ace = PLUGIN_INFO.Acts[key];
  P_C.Acts[camelCasify(key)] = function(...args) {
    return ace.forward ? ace.forward(this).call(this, ...args) : ace.handler.call(this, ...args);
  };
});
Object.keys(PLUGIN_INFO.Cnds).forEach((key) => {
  const ace = PLUGIN_INFO.Cnds[key];
  P_C.Cnds[camelCasify(key)] = function(...args) {
    return ace.forward ? ace.forward(this).call(this, ...args) : ace.handler.call(this, ...args);
  };
});
Object.keys(PLUGIN_INFO.Exps).forEach((key) => {
  const ace = PLUGIN_INFO.Exps[key];
  P_C.Exps[camelCasify(key)] = function(...args) {
    return ace.forward ? ace.forward(this).call(this, ...args) : ace.handler.call(this, ...args);
  };
});
var WebSocketClient = class {
  /**
   * @param {string} url - The URL to connect to.
   * @param {Object} [options={}] - Optional configuration options.
   * @param {number} [options.maxReconnectAttempts=5] - The maximum number of reconnect attempts.
   * @param {number} [options.reconnectInterval=3000] - The interval between reconnect attempts in milliseconds.
   */
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectInterval = options.reconnectInterval || 3e3;
    this.responseResolvers = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Map();
  }
  /**
   * Connects to the WebSocket server.
   * @returns {Promise<WebSocket>} A promise that resolves with the WebSocket instance when connected.
   */
  async connect() {
    const httpUrl = this.url.replace("ws://", "http://");
    const errorMessage = "Server not reachable. Make sure to export or preview with Pipelab.";
    try {
      const response = await fetch(httpUrl);
      if (!response.ok) {
        throw new Error(`${errorMessage}, status: ${response.status}`);
      }
    } catch (error) {
      console.error("error", error);
      throw new Error(errorMessage);
    }
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        if (this.socket) {
          return resolve(this.socket);
        }
        return reject(new Error("WebSocket is undefined"));
      };
      this.socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.correlationId && this.responseResolvers.has(parsedData.correlationId)) {
          const resolver = this.responseResolvers.get(parsedData.correlationId);
          resolver?.(parsedData);
          this.responseResolvers.delete(parsedData.correlationId);
        } else if (parsedData.url) {
          this.#propagateMessage(parsedData);
        } else {
          console.error("unhandled message", parsedData);
        }
      };
      this.socket.onclose = () => {
        this.isConnected = false;
        this.reconnect();
      };
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        return reject(error);
      };
    });
  }
  /**
   * Attempts to reconnect to the WebSocket server.
   */
  async reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.warn(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      try {
        await new Promise((resolve) => setTimeout(resolve, this.reconnectInterval));
        await this.connect();
      } catch (error) {
        console.error("Reconnection attempt failed:", error);
      }
    } else {
      console.warn("Max reconnect attempts reached. Giving up.");
    }
  }
  /**
   * Sends a message to the WebSocket server.
   * @param {import("@pipelab/core").Message} message - The message to send.
   */
  send(message) {
    if (this.isConnected) {
      if (this.socket) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.warn("Cannot send message. WebSocket is undefined.");
      }
    } else {
      console.warn("Cannot send message. WebSocket is not connected.");
    }
  }
  /**
   * Sends a message to the WebSocket server and waits for a response.
   * @template {import("@pipelab/core").Message} TMessage
   * @param {TMessage} message - The message to send.
   * @returns {Promise<any>} A promise that resolves with the response from the server.
   */
  /** @type {<T extends import("@pipelab/core").Message>(message: T) => Promise<import("@pipelab/core").InferResponseFromMessage<typeof message>>} */
  async sendAndWaitForResponse(message) {
    if (!this.isConnected || !this.socket) {
      throw new Error("WebSocket is not connected.");
    }
    const correlationId = this.#generateCorrelationId();
    message.correlationId = correlationId;
    const responsePromise = new Promise((resolve) => {
      this.responseResolvers.set(correlationId, resolve);
    });
    this.socket.send(JSON.stringify(message));
    const result = await responsePromise;
    if (result.body.error) {
      throw new Error(result.body.error);
    } else {
      return result;
    }
  }
  /**
   * Closes the WebSocket connection.
   */
  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
  /**
   * Generates a unique correlation ID.
   * @returns {string} A unique correlation ID.
   */
  #generateCorrelationId() {
    return Math.random().toString(36).substring(2, 15);
  }
  /**
     * Propagates a message to registered listeners.
     * @param {{ url: any; }} message - The message to propagate.
     */
  #propagateMessage(message) {
    const listeners = this.listeners.get(message.url);
    if (listeners) {
      listeners.forEach((listener) => listener(message));
    }
  }
  /**
  * Registers a listener for a specific event.
  * @param {string} event - The event to listen for.
  * @param {Function} listener - The listener function.
  */
  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
  }
  /**
  * Unregisters a listener for a specific event.
  * @param {string} event - The event to stop listening for.
  * @param {Function} listener - The listener function to remove.
  */
  off(event, listener) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      this.listeners.set(event, listeners.filter((l) => l !== listener));
    }
  }
};
var fullscreenPipelabStateToC3State = (state) => {
  switch (state) {
    case "normal":
      return 0;
    case "fullscreen":
      return 1;
    default:
      return 0;
  }
};
var defaultSteamId = {
  accountId: -1,
  steamId32: "",
  steamId64: ""
};
var friendFlagsMap = [
  0,
  // none
  1,
  // blocked
  2,
  // friendshipRequested
  4,
  // immediate
  8,
  // clanMember
  16,
  // onGameServer
  128,
  // requestingFriendship
  256,
  // requestingInfo
  65535
  // all
];
var posixPath = {
  dirname: (path) => {
    const lastSlash = path.lastIndexOf("/");
    return lastSlash === -1 ? "." : path.substring(0, lastSlash);
  },
  join: (dirname, filename) => {
    return dirname.endsWith("/") ? dirname + filename : dirname + "/" + filename;
  }
};
var DOM_COMPONENT_ID = "";
DOM_COMPONENT_ID = "pipelabv2";
var config = {};
config = {
  "addonType": "plugin",
  "id": "pipelabv2",
  "name": "Pipelab",
  "version": "2.7.2",
  "category": "platform-specific",
  "author": "Armaldio",
  "website": "https://github.com/CynToolkit/construct-plugin",
  "documentation": "https://github.com/CynToolkit/construct-plugin",
  "description": "A plugin that integrate with Pipelab",
  "addonUrl": "https://github.com/CynToolkit/construct-plugin",
  "githubUrl": "https://github.com/CynToolkit/construct-plugin",
  "icon": "icon.png",
  "type": "object",
  "domSideScripts": [
    "dom.js"
  ],
  "fileDependencies": [],
  "info": {
    "Set": {
      "IsResizable": false,
      "IsRotatable": false,
      "Is3D": false,
      "HasImage": false,
      "IsTiled": false,
      "SupportsZElevation": false,
      "SupportsColor": false,
      "SupportsEffects": false,
      "MustPreDraw": false,
      "IsSingleGlobal": true,
      "CanBeBundled": true,
      "IsDeprecated": false,
      "GooglePlayServicesEnabled": false
    },
    "AddCommonACEs": {
      "Position": false,
      "SceneGraph": false,
      "Size": false,
      "Angle": false,
      "Appearance": false,
      "ZOrder": false
    }
  },
  "properties": [],
  "aceCategories": {
    "general": "General",
    "window": "Window",
    "filesystem": "File system",
    "file-dialogs": "File Dialogs",
    "command-line": "Command line",
    "steam": "Steam",
    "steam-workshop": "Steam Workshop",
    "discord": "Discord"
  },
  "Acts": {
    "InitializeSync": {
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "category": "general",
      "highlight": false,
      "deprecated": false,
      "listName": "Initialize integration",
      "displayText": '[b]DEPRECATED[/b] - Initialize integration (tag "{0}")',
      "description": "Initialize the Pipelab integration",
      "forward": "_Initialize",
      "isDeprecated": true
    },
    "Initialize": {
      "params": [],
      "category": "general",
      "highlight": false,
      "deprecated": false,
      "listName": "Initialize integration",
      "displayText": "[b]DEPRECATED[/b] - Initialize integration",
      "description": "Initialize the Pipelab integration",
      "forward": "_Initialize",
      "isAsync": true,
      "isDeprecated": true
    },
    "InitializeV2": {
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "category": "general",
      "highlight": false,
      "deprecated": false,
      "listName": "Initialize integration",
      "displayText": "Initialize integration (tag {0})",
      "description": "Initialize the Pipelab integration",
      "forward": "_Initialize",
      "isDeprecated": false,
      "isAsync": true
    },
    "AppendFileSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to append to.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "contents",
          "desc": "The contents to append to the file.",
          "name": "Contents",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Append file",
      "displayText": '[b]DEPRECATED[/b] - Append [b]{0}[/b] to file [i]{1}[/i] (tag "{2}")',
      "description": "Appends the contents to the file.",
      "forward": "_AppendFile",
      "isDeprecated": true
    },
    "AppendFile": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to append to.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "contents",
          "desc": "The contents to append to the file.",
          "name": "Contents",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Append file",
      "displayText": "[b]DEPRECATED[/b] - Append [b]{0}[/b] to file [i]{1}[/i]",
      "description": "Appends the contents to the file.",
      "forward": "_AppendFile",
      "isAsync": true,
      "isDeprecated": true
    },
    "AppendFileV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to append to.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "contents",
          "desc": "The contents to append to the file.",
          "name": "Contents",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Append file",
      "displayText": "Append [b]{0}[/b] to file [i]{1}[/i] (tag {2})",
      "description": "Appends the contents to the file.",
      "forward": "_AppendFile",
      "isDeprecated": false,
      "isAsync": true
    },
    "CopyFileSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "source",
          "desc": "The path to the file to copy.",
          "name": "Source",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The path to the destination file.",
          "name": "Destination",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "overwrite",
          "desc": "Weather to overwrite the destination file.",
          "name": "Overwrite",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Copy file",
      "displayText": '[b]DEPRECATED[/b] - Copy [b]{0}[/b] to [b]{1}[/b] (recursive: {2}) (tag "{3}")',
      "description": "Copies the file.",
      "forward": "_CopyFile",
      "isDeprecated": true
    },
    "CopyFile": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "source",
          "desc": "The path to the file to copy.",
          "name": "Source",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The path to the destination file.",
          "name": "Destination",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "overwrite",
          "desc": "Weather to overwrite the destination file.",
          "name": "Overwrite",
          "type": "boolean",
          "initialValue": "false"
        }
      ],
      "listName": "Copy file",
      "displayText": "[b]DEPRECATED[/b] - Copy [b]{0}[/b] to [b]{1}[/b] (recursive: {2})",
      "description": "Copies the file.",
      "forward": "_CopyFile",
      "isAsync": true,
      "isDeprecated": true
    },
    "CopyFileV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "source",
          "desc": "The path to the file to copy.",
          "name": "Source",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The path to the destination file.",
          "name": "Destination",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "overwrite",
          "desc": "Weather to overwrite the destination file.",
          "name": "Overwrite",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Copy file",
      "displayText": "Copy [b]{0}[/b] to [b]{1}[/b] (recursive: {2}) (tag {3})",
      "description": "Copies the file.",
      "forward": "_CopyFile",
      "isDeprecated": false,
      "isAsync": true
    },
    "FetchFileSizeSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to fetch the size.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Fetch file size",
      "displayText": '[b]DEPRECATED[/b] - Fetch file size of [b]{0}[/b] (tag "{1}")',
      "description": "Fetch the size of the file.",
      "forward": "_FetchFileSize",
      "isDeprecated": true
    },
    "FetchFileSize": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to fetch the size.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Fetch file size",
      "displayText": "[b]DEPRECATED[/b] - Fetch file size of [b]{0}[/b]",
      "description": "Fetch the size of the file.",
      "forward": "_FetchFileSize",
      "isAsync": true,
      "isDeprecated": true
    },
    "FetchFileSizeV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to fetch the size.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Fetch file size",
      "displayText": "Fetch file size of [b]{0}[/b] (tag {1})",
      "description": "Fetch the size of the file.",
      "forward": "_FetchFileSize",
      "isDeprecated": false,
      "isAsync": true
    },
    "CreateFolderSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the folder to create.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "recursive",
          "desc": "Whether to create the folder recursively.",
          "name": "Recursive",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Create folder",
      "displayText": '[b]DEPRECATED[/b] - Create folder [b]{0}[/b] (recursive: {1}) (tag "{2}")',
      "description": "Creates the folder.",
      "forward": "_CreateFolder",
      "isDeprecated": true
    },
    "CreateFolder": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the folder to create.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "recursive",
          "desc": "Whether to create the folder recursively.",
          "name": "Recursive",
          "type": "boolean",
          "initialValue": "false"
        }
      ],
      "listName": "Create folder",
      "displayText": "[b]DEPRECATED[/b] - Create folder [b]{0}[/b] (recursive: {1})",
      "description": "Creates the folder.",
      "forward": "_CreateFolder",
      "isAsync": true,
      "isDeprecated": true
    },
    "CreateFolderV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the folder to create.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "recursive",
          "desc": "Whether to create the folder recursively.",
          "name": "Recursive",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Create folder",
      "displayText": "Create folder [b]{0}[/b] (recursive: {1}) (tag {2})",
      "description": "Creates the folder.",
      "forward": "_CreateFolder",
      "isDeprecated": false,
      "isAsync": true
    },
    "DeleteFileSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to delete.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "recursive",
          "desc": "Weather to remove files recursively.",
          "name": "Recursive",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Delete file",
      "displayText": '[b]DEPRECATED[/b] - Delete file [b]{0}[/b] (recursive: {1}) (tag "{2}")',
      "description": "Deletes the file.",
      "forward": "_DeleteFile",
      "isDeprecated": true
    },
    "DeleteFile": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to delete.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "recursive",
          "desc": "Weather to remove files recursively.",
          "name": "Recursive",
          "type": "boolean",
          "initialValue": "false"
        }
      ],
      "listName": "Delete file",
      "displayText": "[b]DEPRECATED[/b] - Delete file [b]{0}[/b] (recursive: {1})",
      "description": "Deletes the file.",
      "forward": "_DeleteFile",
      "isAsync": true,
      "isDeprecated": true
    },
    "DeleteFileV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to delete.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "recursive",
          "desc": "Weather to remove files recursively.",
          "name": "Recursive",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Delete file",
      "displayText": "Delete file [b]{0}[/b] (recursive: {1}) (tag {2})",
      "description": "Deletes the file.",
      "forward": "_DeleteFile",
      "isDeprecated": false,
      "isAsync": true
    },
    "ListFilesSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the folder to list.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "recursive",
          "desc": "Weather to list files recursively.",
          "name": "Recursive",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "List files",
      "displayText": '[b]DEPRECATED[/b] - List files in [b]{0}[/b] (recursive: {1}) (tag "{2}")',
      "description": "Load a list of files in a given folder. Use expressions after this action to get the count and file names",
      "forward": "_ListFiles",
      "isDeprecated": true
    },
    "ListFiles": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the folder to list.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "recursive",
          "desc": "Weather to list files recursively.",
          "name": "Recursive",
          "type": "boolean",
          "initialValue": "false"
        }
      ],
      "listName": "List files",
      "displayText": "[b]DEPRECATED[/b] - List files in [b]{0}[/b] (recursive: {1})",
      "description": "Load a list of files in a given folder. Use expressions after this action to get the count and file names",
      "forward": "_ListFiles",
      "isAsync": true,
      "isDeprecated": true
    },
    "ListFilesV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the folder to list.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "recursive",
          "desc": "Weather to list files recursively.",
          "name": "Recursive",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "List files",
      "displayText": "List files in [b]{0}[/b] (recursive: {1}) (tag {2})",
      "description": "Load a list of files in a given folder. Use expressions after this action to get the count and file names",
      "forward": "_ListFiles",
      "isDeprecated": false,
      "isAsync": true
    },
    "MoveFileSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "source",
          "desc": "The path to the file to move.",
          "name": "Source",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The path to the destination file.",
          "name": "Destination",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "overwrite",
          "desc": "Weather to overwrite the destination file.",
          "name": "Overwrite",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Move file",
      "displayText": '[b]DEPRECATED[/b] - Move [b]{0}[/b] to [b]{1}[/b] (overwrite: {2}) (tag "{3}")',
      "description": "Moves the file.",
      "forward": "_MoveFile",
      "isDeprecated": true
    },
    "MoveFile": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "source",
          "desc": "The path to the file to move.",
          "name": "Source",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The path to the destination file.",
          "name": "Destination",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "overwrite",
          "desc": "Weather to overwrite the destination file.",
          "name": "Overwrite",
          "type": "boolean",
          "initialValue": "false"
        }
      ],
      "listName": "Move file",
      "displayText": "[b]DEPRECATED[/b] - Move [b]{0}[/b] to [b]{1}[/b] (overwrite: {2})",
      "description": "Moves the file.",
      "forward": "_MoveFile",
      "isAsync": true,
      "isDeprecated": true
    },
    "MoveFileV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "source",
          "desc": "The path to the file to move.",
          "name": "Source",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The path to the destination file.",
          "name": "Destination",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "overwrite",
          "desc": "Weather to overwrite the destination file.",
          "name": "Overwrite",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Move file",
      "displayText": "Move [b]{0}[/b] to [b]{1}[/b] (overwrite: {2}) (tag {3})",
      "description": "Moves the file.",
      "forward": "_MoveFile",
      "isDeprecated": false,
      "isAsync": true
    },
    "OpenBrowserSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "url",
          "desc": "The URL to open.",
          "name": "URL",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Open browser",
      "displayText": '[b]DEPRECATED[/b] - Open browser to [b]{0}[/b] (tag "{1}")',
      "description": "Opens the browser.",
      "forward": "_OpenBrowser",
      "isDeprecated": true
    },
    "OpenBrowser": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "url",
          "desc": "The URL to open.",
          "name": "URL",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Open browser",
      "displayText": "[b]DEPRECATED[/b] - Open browser to [b]{0}[/b]",
      "description": "Opens the browser.",
      "forward": "_OpenBrowser",
      "isAsync": true,
      "isDeprecated": true
    },
    "OpenBrowserV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "url",
          "desc": "The URL to open.",
          "name": "URL",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Open browser",
      "displayText": "Open browser to [b]{0}[/b] (tag {1})",
      "description": "Opens the browser.",
      "forward": "_OpenBrowser",
      "isDeprecated": false,
      "isAsync": true
    },
    "ReadBinaryFileSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to read.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The Binary Data object to store the file contents.",
          "name": "Destination",
          "type": "object",
          "allowedPluginIds": [
            "BinaryData"
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Read binary file",
      "displayText": '[b]DEPRECATED[/b] - Read binary file [b]{0}[/b] into [b]{1}[/b] (tag "{2}")',
      "description": "Reads a file into a Binary Data object. Triggers 'On binary file read' when completes.",
      "forward": "_ReadBinaryFile",
      "isDeprecated": true
    },
    "ReadBinaryFile": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to read.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The Binary Data object to store the file contents.",
          "name": "Destination",
          "type": "object",
          "allowedPluginIds": [
            "BinaryData"
          ]
        }
      ],
      "listName": "Read binary file",
      "displayText": "[b]DEPRECATED[/b] - Read binary file [b]{0}[/b] into [b]{1}[/b]",
      "description": "Reads a file into a Binary Data object. Triggers 'On binary file read' when completes.",
      "forward": "_ReadBinaryFile",
      "isAsync": true,
      "isDeprecated": true
    },
    "ReadBinaryFileV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to read.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The Binary Data object to store the file contents.",
          "name": "Destination",
          "type": "object",
          "allowedPluginIds": [
            "BinaryData"
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Read binary file",
      "displayText": "Read binary file [b]{0}[/b] into [b]{1}[/b] (tag {2})",
      "description": "Reads a file into a Binary Data object. Triggers 'On binary file read' when completes.",
      "forward": "_ReadBinaryFile",
      "isDeprecated": false,
      "isAsync": true
    },
    "RenameFileSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "source",
          "desc": "The path to rename.",
          "name": "Existing file",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The new file name.",
          "name": "New name",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "overwrite",
          "desc": "Weather to overwrite the destination file.",
          "name": "Overwrite",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Rename file",
      "displayText": '[b]DEPRECATED[/b] - Rename [b]{0}[/b] to [b]{1}[/b] (overwrite: {2}) (tag "{3}")',
      "description": "Renames the file.",
      "forward": "_RenameFile",
      "isDeprecated": true
    },
    "RenameFile": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "source",
          "desc": "The path to rename.",
          "name": "Existing file",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The new file name.",
          "name": "New name",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "overwrite",
          "desc": "Weather to overwrite the destination file.",
          "name": "Overwrite",
          "type": "boolean",
          "initialValue": "false"
        }
      ],
      "listName": "Rename file",
      "displayText": "[b]DEPRECATED[/b] - Rename [b]{0}[/b] to [b]{1}[/b] (overwrite: {2})",
      "description": "Renames the file.",
      "forward": "_RenameFile",
      "isAsync": true,
      "isDeprecated": true
    },
    "RenameFileV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "source",
          "desc": "The path to rename.",
          "name": "Existing file",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "destination",
          "desc": "The new file name.",
          "name": "New name",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "overwrite",
          "desc": "Weather to overwrite the destination file.",
          "name": "Overwrite",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Rename file",
      "displayText": "Rename [b]{0}[/b] to [b]{1}[/b] (overwrite: {2}) (tag {3})",
      "description": "Renames the file.",
      "forward": "_RenameFile",
      "isDeprecated": false,
      "isAsync": true
    },
    "RunFileSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": 'Enter the path of the file to execute. This can also include space-separated arguments. To execute a path wtih spaces in it, wrap in double-quotes (e.g. """ C:\\Program Files\\file.exe"""',
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Run file",
      "displayText": '[b]DEPRECATED[/b] - Run file [b]{0}[/b] (tag "{1}")',
      "description": "Runs the file.",
      "forward": "_RunFile",
      "isDeprecated": true
    },
    "RunFile": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": 'Enter the path of the file to execute. This can also include space-separated arguments. To execute a path wtih spaces in it, wrap in double-quotes (e.g. """ C:\\Program Files\\file.exe"""',
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Run file",
      "displayText": "[b]DEPRECATED[/b] - Run file [b]{0}[/b]",
      "description": "Runs the file.",
      "forward": "_RunFile",
      "isAsync": true,
      "isDeprecated": true
    },
    "RunFileV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": 'Enter the path of the file to execute. This can also include space-separated arguments. To execute a path wtih spaces in it, wrap in double-quotes (e.g. """ C:\\Program Files\\file.exe"""',
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Run file",
      "displayText": "Run file [b]{0}[/b] (tag {1})",
      "description": "Runs the file.",
      "forward": "_RunFile",
      "isDeprecated": false,
      "isAsync": true
    },
    "ShellOpenSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to open. The default app associated with the file type will be used.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Shell open",
      "displayText": '[b]DEPRECATED[/b] - Shell open [b]{0}[/b] (tag "{1}")',
      "description": "Opens the file in the shell.",
      "forward": "_ShellOpen",
      "isDeprecated": true
    },
    "ShellOpen": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to open. The default app associated with the file type will be used.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Shell open",
      "displayText": "[b]DEPRECATED[/b] - Shell open [b]{0}[/b]",
      "description": "Opens the file in the shell.",
      "forward": "_ShellOpen",
      "isAsync": true,
      "isDeprecated": true
    },
    "ShellOpenV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to open. The default app associated with the file type will be used.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Shell open",
      "displayText": "Shell open [b]{0}[/b] (tag {1})",
      "description": "Opens the file in the shell.",
      "forward": "_ShellOpen",
      "isDeprecated": false,
      "isAsync": true
    },
    "ExplorerOpenSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to show in the default explorer.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Explorer open",
      "displayText": '[b]DEPRECATED[/b] - Explorer open [b]{0}[/b] (tag "{1}")',
      "description": "Opens the path in the explorer.",
      "forward": "_ExplorerOpen",
      "isDeprecated": true
    },
    "ExplorerOpen": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to show in the default explorer.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Explorer open",
      "displayText": "[b]DEPRECATED[/b] - Explorer open [b]{0}[/b]",
      "description": "Opens the path in the explorer.",
      "forward": "_ExplorerOpen",
      "isAsync": true,
      "isDeprecated": true
    },
    "ExplorerOpenV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to show in the default explorer.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Explorer open",
      "displayText": "Explorer open [b]{0}[/b] (tag {1})",
      "description": "Opens the path in the explorer.",
      "forward": "_ExplorerOpen",
      "isDeprecated": false,
      "isAsync": true
    },
    "WriteBinaryFileSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to write.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "source",
          "desc": "The Binary Data object to read the file contents from.",
          "name": "Source",
          "type": "object",
          "allowedPluginIds": [
            "BinaryData"
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Write binary file",
      "displayText": '[b]DEPRECATED[/b] - Write binary file [b]{0}[/b] from [b]{1}[/b] (tag "{2}")',
      "description": "Writes the binary file.",
      "forward": "_WriteBinaryFile",
      "isDeprecated": true
    },
    "WriteBinaryFile": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to write.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "source",
          "desc": "The Binary Data object to read the file contents from.",
          "name": "Source",
          "type": "object",
          "allowedPluginIds": [
            "BinaryData"
          ]
        }
      ],
      "listName": "Write binary file",
      "displayText": "[b]DEPRECATED[/b] - Write binary file [b]{0}[/b] from [b]{1}[/b]",
      "description": "Writes the binary file.",
      "forward": "_WriteBinaryFile",
      "isAsync": true,
      "isDeprecated": true
    },
    "WriteBinaryFileV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to write.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "source",
          "desc": "The Binary Data object to read the file contents from.",
          "name": "Source",
          "type": "object",
          "allowedPluginIds": [
            "BinaryData"
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Write binary file",
      "displayText": "Write binary file [b]{0}[/b] from [b]{1}[/b] (tag {2})",
      "description": "Writes the binary file.",
      "forward": "_WriteBinaryFile",
      "isDeprecated": false,
      "isAsync": true
    },
    "WriteTextFileSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to write.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "contents",
          "desc": "The contents to write to the file.",
          "name": "Contents",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Write text file",
      "displayText": '[b]DEPRECATED[/b] - Write text file [b]{1}[/b] to [b]{0}[/b] (tag "{2}")',
      "description": "Writes the text file.",
      "forward": "_WriteTextFile",
      "isDeprecated": true
    },
    "WriteTextFile": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to write.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "contents",
          "desc": "The contents to write to the file.",
          "name": "Contents",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Write text file",
      "displayText": "[b]DEPRECATED[/b] - Write text file [b]{1}[/b] to [b]{0}[/b]",
      "description": "Writes the text file.",
      "forward": "_WriteTextFile",
      "isAsync": true,
      "isDeprecated": true
    },
    "WriteTextFileV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to write.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "contents",
          "desc": "The contents to write to the file.",
          "name": "Contents",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Write text file",
      "displayText": "Write text file [b]{1}[/b] to [b]{0}[/b] (tag {2})",
      "description": "Writes the text file.",
      "forward": "_WriteTextFile",
      "isDeprecated": false,
      "isAsync": true
    },
    "WriteTextSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": true,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to write.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "contents",
          "desc": "The contents to write to the file.",
          "name": "Contents",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Write text file",
      "displayText": '[b]DEPRECATED[/b] - Write text file [b]{0}[/b] to [b]{1}[/b] (tag "{2}")',
      "description": "Writes the text file.",
      "forward": "_WriteText",
      "isDeprecated": true
    },
    "WriteText": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": true,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to write.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "contents",
          "desc": "The contents to write to the file.",
          "name": "Contents",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Write text file",
      "displayText": "[b]DEPRECATED[/b] - Write text file [b]{0}[/b] to [b]{1}[/b]",
      "description": "Writes the text file.",
      "forward": "_WriteText",
      "isAsync": true,
      "isDeprecated": true
    },
    "WriteTextV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": true,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to write.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "contents",
          "desc": "The contents to write to the file.",
          "name": "Contents",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Write text file",
      "displayText": "Write text file [b]{0}[/b] to [b]{1}[/b] (tag {2})",
      "description": "Writes the text file.",
      "forward": "_WriteText",
      "isDeprecated": true,
      "isAsync": true
    },
    "ReadTextFileSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to read.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "description": "Reads the text file.",
      "listName": "Read text file",
      "displayText": '[b]DEPRECATED[/b] - Read text file [b]{0}[/b] (tag "{1}")',
      "forward": "_ReadTextFile",
      "isDeprecated": true
    },
    "ReadTextFile": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to read.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "description": "Reads the text file.",
      "listName": "Read text file",
      "displayText": "[b]DEPRECATED[/b] - Read text file [b]{0}[/b]",
      "forward": "_ReadTextFile",
      "isAsync": true,
      "isDeprecated": true
    },
    "ReadTextFileV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to the file to read.",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "description": "Reads the text file.",
      "listName": "Read text file",
      "displayText": "Read text file [b]{0}[/b] (tag {1})",
      "forward": "_ReadTextFile",
      "isDeprecated": false,
      "isAsync": true
    },
    "CheckIfPathExistSync": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to check",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "description": "Check if the path exist.",
      "listName": "Check if the path exist",
      "displayText": '[b]DEPRECATED[/b] - Check if path [b]{0}[/b] exists (tag "{1}")',
      "forward": "_CheckIfPathExist",
      "isDeprecated": true
    },
    "CheckIfPathExist": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to check",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "description": "Check if the path exist.",
      "listName": "Check if the path exist",
      "displayText": "[b]DEPRECATED[/b] - Check if path [b]{0}[/b] exists",
      "forward": "_CheckIfPathExist",
      "isAsync": true,
      "isDeprecated": true
    },
    "CheckIfPathExistV2": {
      "category": "filesystem",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "path",
          "desc": "The path to check",
          "name": "Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "description": "Check if the path exist.",
      "listName": "Check if the path exist",
      "displayText": "Check if path [b]{0}[/b] exists (tag {1})",
      "forward": "_CheckIfPathExist",
      "isDeprecated": false,
      "isAsync": true
    },
    "ShowFolderDialogSync": {
      "category": "file-dialogs",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Show folder dialog",
      "displayText": '[b]DEPRECATED[/b] - Show folder dialog (tag "{0}")',
      "description": "Show a folder dialog",
      "forward": "_ShowFolderDialog",
      "isDeprecated": true
    },
    "ShowFolderDialog": {
      "category": "file-dialogs",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Show folder dialog",
      "displayText": "[b]DEPRECATED[/b] - Show folder dialog",
      "description": "Show a folder dialog",
      "forward": "_ShowFolderDialog",
      "isAsync": true,
      "isDeprecated": true
    },
    "ShowFolderDialogV2": {
      "category": "file-dialogs",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Show folder dialog",
      "displayText": "Show folder dialog (tag {0})",
      "description": "Show a folder dialog",
      "forward": "_ShowFolderDialog",
      "isDeprecated": false,
      "isAsync": true
    },
    "ShowOpenDialogSync": {
      "category": "file-dialogs",
      "highlight": false,
      "deprecated": false,
      "listName": "Show open dialog",
      "displayText": '[b]DEPRECATED[/b] - Show open dialog {0} (tag "{1}")',
      "description": "Show an open dialog",
      "params": [
        {
          "id": "accept",
          "desc": "The file types to accept.",
          "name": "Accept",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "forward": "_ShowOpenDialog",
      "isDeprecated": true
    },
    "ShowOpenDialog": {
      "category": "file-dialogs",
      "highlight": false,
      "deprecated": false,
      "listName": "Show open dialog",
      "displayText": "[b]DEPRECATED[/b] - Show open dialog {0}",
      "description": "Show an open dialog",
      "params": [
        {
          "id": "accept",
          "desc": "The file types to accept.",
          "name": "Accept",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "forward": "_ShowOpenDialog",
      "isAsync": true,
      "isDeprecated": true
    },
    "ShowOpenDialogV2": {
      "category": "file-dialogs",
      "highlight": false,
      "deprecated": false,
      "listName": "Show open dialog",
      "displayText": "Show open dialog {0} (tag {1})",
      "description": "Show an open dialog",
      "params": [
        {
          "id": "accept",
          "desc": "The file types to accept.",
          "name": "Accept",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "forward": "_ShowOpenDialog",
      "isDeprecated": false,
      "isAsync": true
    },
    "ShowSaveDialogSync": {
      "category": "file-dialogs",
      "highlight": false,
      "deprecated": false,
      "listName": "Show save dialog",
      "displayText": '[b]DEPRECATED[/b] - Show save dialog {0} (tag "{1}")',
      "description": "Show a save dialog",
      "params": [
        {
          "id": "accept",
          "desc": "The file types to accept.",
          "name": "Accept",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "forward": "_ShowSaveDialog",
      "isDeprecated": true
    },
    "ShowSaveDialog": {
      "category": "file-dialogs",
      "highlight": false,
      "deprecated": false,
      "listName": "Show save dialog",
      "displayText": "[b]DEPRECATED[/b] - Show save dialog {0}",
      "description": "Show a save dialog",
      "params": [
        {
          "id": "accept",
          "desc": "The file types to accept.",
          "name": "Accept",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "forward": "_ShowSaveDialog",
      "isAsync": true,
      "isDeprecated": true
    },
    "ShowSaveDialogV2": {
      "category": "file-dialogs",
      "highlight": false,
      "deprecated": false,
      "listName": "Show save dialog",
      "displayText": "Show save dialog {0} (tag {1})",
      "description": "Show a save dialog",
      "params": [
        {
          "id": "accept",
          "desc": "The file types to accept.",
          "name": "Accept",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "forward": "_ShowSaveDialog",
      "isDeprecated": false,
      "isAsync": true
    },
    "MaximizeSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Maximize",
      "displayText": '[b]DEPRECATED[/b] - Maximize window (tag "{0}")',
      "description": "Maximize the window",
      "forward": "_Maximize",
      "isDeprecated": true
    },
    "Maximize": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Maximize",
      "displayText": "[b]DEPRECATED[/b] - Maximize window",
      "description": "Maximize the window",
      "forward": "_Maximize",
      "isAsync": true,
      "isDeprecated": true
    },
    "MaximizeV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Maximize",
      "displayText": "Maximize window (tag {0})",
      "description": "Maximize the window",
      "forward": "_Maximize",
      "isDeprecated": false,
      "isAsync": true
    },
    "MinimizeSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Minimize",
      "displayText": '[b]DEPRECATED[/b] - Minimize window (tag "{0}")',
      "description": "Minimize the window",
      "forward": "_Minimize",
      "isDeprecated": true
    },
    "Minimize": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Minimize",
      "displayText": "[b]DEPRECATED[/b] - Minimize window",
      "description": "Minimize the window",
      "forward": "_Minimize",
      "isAsync": true,
      "isDeprecated": true
    },
    "MinimizeV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Minimize",
      "displayText": "Minimize window (tag {0})",
      "description": "Minimize the window",
      "forward": "_Minimize",
      "isDeprecated": false,
      "isAsync": true
    },
    "RestoreSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Restore",
      "displayText": '[b]DEPRECATED[/b] - Restore window (tag "{0}")',
      "description": "Restore the window (i.e. show again after minimizing)",
      "forward": "_Restore",
      "isDeprecated": true
    },
    "Restore": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Restore",
      "displayText": "[b]DEPRECATED[/b] - Restore window",
      "description": "Restore the window (i.e. show again after minimizing)",
      "forward": "_Restore",
      "isAsync": true,
      "isDeprecated": true
    },
    "RestoreV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Restore",
      "displayText": "Restore window (tag {0})",
      "description": "Restore the window (i.e. show again after minimizing)",
      "forward": "_Restore",
      "isDeprecated": false,
      "isAsync": true
    },
    "RequestAttentionSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "listName": "Request attention",
      "displayText": '[b]DEPRECATED[/b] - Request window attention with mode {0} (tag "{1}")',
      "description": "Start or stop requesting attention from the user, e.g. by flashing the title bar (depends on OS).",
      "params": [
        {
          "id": "mode",
          "desc": "Whether to request attention or cancel a previous request for Attention.",
          "name": "Mode",
          "type": "combo",
          "items": [
            {
              "request": "Request attention"
            },
            {
              "cancel": "Stop requesting attention"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "forward": "_RequestAttention",
      "isDeprecated": true
    },
    "RequestAttention": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "listName": "Request attention",
      "displayText": "[b]DEPRECATED[/b] - Request window attention with mode {0}",
      "description": "Start or stop requesting attention from the user, e.g. by flashing the title bar (depends on OS).",
      "params": [
        {
          "id": "mode",
          "desc": "Whether to request attention or cancel a previous request for Attention.",
          "name": "Mode",
          "type": "combo",
          "items": [
            {
              "request": "Request attention"
            },
            {
              "cancel": "Stop requesting attention"
            }
          ]
        }
      ],
      "forward": "_RequestAttention",
      "isAsync": true,
      "isDeprecated": true
    },
    "RequestAttentionV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "listName": "Request attention",
      "displayText": "Request window attention with mode {0} (tag {1})",
      "description": "Start or stop requesting attention from the user, e.g. by flashing the title bar (depends on OS).",
      "params": [
        {
          "id": "mode",
          "desc": "Whether to request attention or cancel a previous request for Attention.",
          "name": "Mode",
          "type": "combo",
          "items": [
            {
              "request": "Request attention"
            },
            {
              "cancel": "Stop requesting attention"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "forward": "_RequestAttention",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetAlwaysOnTopSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "mode",
          "desc": "Whether to enable or disable the window always being on top.",
          "name": "Mode",
          "type": "combo",
          "items": [
            {
              "disable": "Always on top"
            },
            {
              "enable": "Not always on top"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set always on top",
      "displayText": '[b]DEPRECATED[/b] - Set always on top to {0} (tag "{1}")',
      "description": "Enable or disable the window always being on top of other windows.",
      "forward": "_SetAlwaysOnTop",
      "isDeprecated": true
    },
    "SetAlwaysOnTop": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "mode",
          "desc": "Whether to enable or disable the window always being on top.",
          "name": "Mode",
          "type": "combo",
          "items": [
            {
              "disable": "Always on top"
            },
            {
              "enable": "Not always on top"
            }
          ]
        }
      ],
      "listName": "Set always on top",
      "displayText": "[b]DEPRECATED[/b] - Set always on top to {0}",
      "description": "Enable or disable the window always being on top of other windows.",
      "forward": "_SetAlwaysOnTop",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetAlwaysOnTopV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "mode",
          "desc": "Whether to enable or disable the window always being on top.",
          "name": "Mode",
          "type": "combo",
          "items": [
            {
              "disable": "Always on top"
            },
            {
              "enable": "Not always on top"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set always on top",
      "displayText": "Set always on top to {0} (tag {1})",
      "description": "Enable or disable the window always being on top of other windows.",
      "forward": "_SetAlwaysOnTop",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetHeightSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "height",
          "desc": "The new height of the window.",
          "name": "Height",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set height",
      "displayText": '[b]DEPRECATED[/b] - Set window height to {0} (tag "{1}")',
      "description": "Set the height of the window.",
      "forward": "_SetHeight",
      "isDeprecated": true
    },
    "SetHeight": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "height",
          "desc": "The new height of the window.",
          "name": "Height",
          "type": "number",
          "initialValue": 0
        }
      ],
      "listName": "Set height",
      "displayText": "[b]DEPRECATED[/b] - Set window height to {0}",
      "description": "Set the height of the window.",
      "forward": "_SetHeight",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetHeightV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "height",
          "desc": "The new height of the window.",
          "name": "Height",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set height",
      "displayText": "Set window height to {0} (tag {1})",
      "description": "Set the height of the window.",
      "forward": "_SetHeight",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetMaximumSizeSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "width",
          "desc": "The maximum window width to set, in pixels.",
          "name": "Max width",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "height",
          "desc": "The maximum window height to set, in pixels.",
          "name": "Max height",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set maximum size",
      "displayText": '[b]DEPRECATED[/b] - Set maximum size to [b]{0}[/b] x [b]{1}[/b] (tag "{2}")',
      "description": "Set the maximum size of the window.",
      "forward": "_SetMaximumSize",
      "isDeprecated": true
    },
    "SetMaximumSize": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "width",
          "desc": "The maximum window width to set, in pixels.",
          "name": "Max width",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "height",
          "desc": "The maximum window height to set, in pixels.",
          "name": "Max height",
          "type": "number",
          "initialValue": 0
        }
      ],
      "listName": "Set maximum size",
      "displayText": "[b]DEPRECATED[/b] - Set maximum size to [b]{0}[/b] x [b]{1}[/b]",
      "description": "Set the maximum size of the window.",
      "forward": "_SetMaximumSize",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetMaximumSizeV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "width",
          "desc": "The maximum window width to set, in pixels.",
          "name": "Max width",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "height",
          "desc": "The maximum window height to set, in pixels.",
          "name": "Max height",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set maximum size",
      "displayText": "Set maximum size to [b]{0}[/b] x [b]{1}[/b] (tag {2})",
      "description": "Set the maximum size of the window.",
      "forward": "_SetMaximumSize",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetMinimumSizeSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "width",
          "desc": "The minimum window width to set, in pixels.",
          "name": "Max width",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "height",
          "desc": "The minimum window height to set, in pixels.",
          "name": "Max height",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set minimum size",
      "displayText": '[b]DEPRECATED[/b] - Set minimum size to [b]{0}[/b] x [b]{1}[/b] (tag "{2}")',
      "description": "Set the minimum size of the window.",
      "forward": "_SetMinimumSize",
      "isDeprecated": true
    },
    "SetMinimumSize": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "width",
          "desc": "The minimum window width to set, in pixels.",
          "name": "Max width",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "height",
          "desc": "The minimum window height to set, in pixels.",
          "name": "Max height",
          "type": "number",
          "initialValue": 0
        }
      ],
      "listName": "Set minimum size",
      "displayText": "[b]DEPRECATED[/b] - Set minimum size to [b]{0}[/b] x [b]{1}[/b]",
      "description": "Set the minimum size of the window.",
      "forward": "_SetMinimumSize",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetMinimumSizeV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "width",
          "desc": "The minimum window width to set, in pixels.",
          "name": "Max width",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "height",
          "desc": "The minimum window height to set, in pixels.",
          "name": "Max height",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set minimum size",
      "displayText": "Set minimum size to [b]{0}[/b] x [b]{1}[/b] (tag {2})",
      "description": "Set the minimum size of the window.",
      "forward": "_SetMinimumSize",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetResizableSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "resizable",
          "desc": "Whether to enable or disable the window resizing.",
          "name": "Resizable",
          "type": "combo",
          "items": [
            {
              "disable": "Resizable"
            },
            {
              "enable": "Not resizable"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set resizable",
      "displayText": '[b]DEPRECATED[/b] - Set window {0} (tag "{1}")',
      "description": "Enable or disable the window resizing.",
      "forward": "_SetResizable",
      "isDeprecated": true
    },
    "SetResizable": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "resizable",
          "desc": "Whether to enable or disable the window resizing.",
          "name": "Resizable",
          "type": "combo",
          "items": [
            {
              "disable": "Resizable"
            },
            {
              "enable": "Not resizable"
            }
          ]
        }
      ],
      "listName": "Set resizable",
      "displayText": "[b]DEPRECATED[/b] - Set window {0}",
      "description": "Enable or disable the window resizing.",
      "forward": "_SetResizable",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetResizableV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "resizable",
          "desc": "Whether to enable or disable the window resizing.",
          "name": "Resizable",
          "type": "combo",
          "items": [
            {
              "disable": "Resizable"
            },
            {
              "enable": "Not resizable"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set resizable",
      "displayText": "Set window {0} (tag {1})",
      "description": "Enable or disable the window resizing.",
      "forward": "_SetResizable",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetTitleSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "title",
          "desc": "A string to display in the title bar.",
          "name": "Title",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set title",
      "displayText": '[b]DEPRECATED[/b] - Set window title to [b]{0}[/b] (tag "{1}")',
      "description": "Set the title of the window.",
      "forward": "_SetTitle",
      "isDeprecated": true
    },
    "SetTitle": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "title",
          "desc": "A string to display in the title bar.",
          "name": "Title",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set title",
      "displayText": "[b]DEPRECATED[/b] - Set window title to [b]{0}[/b]",
      "description": "Set the title of the window.",
      "forward": "_SetTitle",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetTitleV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "title",
          "desc": "A string to display in the title bar.",
          "name": "Title",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set title",
      "displayText": "Set window title to [b]{0}[/b] (tag {1})",
      "description": "Set the title of the window.",
      "forward": "_SetTitle",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetWidthSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "width",
          "desc": "The new width of the window.",
          "name": "Width",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set width",
      "displayText": '[b]DEPRECATED[/b] - Set window width to {0} (tag "{1}")',
      "description": "Set the width of the window.",
      "forward": "_SetWidth",
      "isDeprecated": true
    },
    "SetWidth": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "width",
          "desc": "The new width of the window.",
          "name": "Width",
          "type": "number",
          "initialValue": 0
        }
      ],
      "listName": "Set width",
      "displayText": "[b]DEPRECATED[/b] - Set window width to {0}",
      "description": "Set the width of the window.",
      "forward": "_SetWidth",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetWidthV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "width",
          "desc": "The new width of the window.",
          "name": "Width",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set width",
      "displayText": "Set window width to {0} (tag {1})",
      "description": "Set the width of the window.",
      "forward": "_SetWidth",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetXSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "x",
          "desc": "The new x position of the window.",
          "name": "X",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set x",
      "displayText": '[b]DEPRECATED[/b] - Set window X position to {0} (tag "{1}")',
      "description": "Set the x position of the window.",
      "forward": "_SetX",
      "isDeprecated": true
    },
    "SetX": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "x",
          "desc": "The new x position of the window.",
          "name": "X",
          "type": "number",
          "initialValue": 0
        }
      ],
      "listName": "Set x",
      "displayText": "[b]DEPRECATED[/b] - Set window X position to {0}",
      "description": "Set the x position of the window.",
      "forward": "_SetX",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetXV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "x",
          "desc": "The new x position of the window.",
          "name": "X",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set x",
      "displayText": "Set window X position to {0} (tag {1})",
      "description": "Set the x position of the window.",
      "forward": "_SetX",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetYSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "y",
          "desc": "The new y position of the window.",
          "name": "Y",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set y",
      "displayText": '[b]DEPRECATED[/b] - Set window Y position to {0} (tag "{1}")',
      "description": "Set the y position of the window.",
      "forward": "_SetY",
      "isDeprecated": true
    },
    "SetY": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "y",
          "desc": "The new y position of the window.",
          "name": "Y",
          "type": "number",
          "initialValue": 0
        }
      ],
      "listName": "Set y",
      "displayText": "[b]DEPRECATED[/b] - Set window Y position to {0}",
      "description": "Set the y position of the window.",
      "forward": "_SetY",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetYV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "y",
          "desc": "The new y position of the window.",
          "name": "Y",
          "type": "number",
          "initialValue": 0
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set y",
      "displayText": "Set window Y position to {0} (tag {1})",
      "description": "Set the y position of the window.",
      "forward": "_SetY",
      "isDeprecated": false,
      "isAsync": true
    },
    "ShowDevToolsSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "show",
          "desc": "Whether to show or hide the dev tools.",
          "name": "Show",
          "type": "combo",
          "items": [
            {
              "hide": "Hide dev tools"
            },
            {
              "show": "Show dev tools"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Show dev tools",
      "displayText": '[b]DEPRECATED[/b] - Set devtool to {0} (tag "{1}")',
      "description": "Show or hide the dev tools.",
      "forward": "_ShowDevTools",
      "isDeprecated": true
    },
    "ShowDevTools": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "show",
          "desc": "Whether to show or hide the dev tools.",
          "name": "Show",
          "type": "combo",
          "items": [
            {
              "hide": "Hide dev tools"
            },
            {
              "show": "Show dev tools"
            }
          ]
        }
      ],
      "listName": "Show dev tools",
      "displayText": "[b]DEPRECATED[/b] - Set devtool to {0}",
      "description": "Show or hide the dev tools.",
      "forward": "_ShowDevTools",
      "isAsync": true,
      "isDeprecated": true
    },
    "ShowDevToolsV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "show",
          "desc": "Whether to show or hide the dev tools.",
          "name": "Show",
          "type": "combo",
          "items": [
            {
              "hide": "Hide dev tools"
            },
            {
              "show": "Show dev tools"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Show dev tools",
      "displayText": "Set devtool to {0} (tag {1})",
      "description": "Show or hide the dev tools.",
      "forward": "_ShowDevTools",
      "isDeprecated": false,
      "isAsync": true
    },
    "UnmaximizeSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Unmaximize",
      "displayText": '[b]DEPRECATED[/b] - Unmaximize window (tag "{0}")',
      "description": "Unmaximize the window",
      "forward": "_Unmaximize",
      "isDeprecated": true
    },
    "Unmaximize": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Unmaximize",
      "displayText": "[b]DEPRECATED[/b] - Unmaximize window",
      "description": "Unmaximize the window",
      "forward": "_Unmaximize",
      "isAsync": true,
      "isDeprecated": true
    },
    "UnmaximizeV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Unmaximize",
      "displayText": "Unmaximize window (tag {0})",
      "description": "Unmaximize the window",
      "forward": "_Unmaximize",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetFullscreenSync": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "fullscreen",
          "desc": "Whether to set fullscreen or not.",
          "name": "Fullscreen",
          "type": "combo",
          "items": [
            {
              "normal": "Normal"
            },
            {
              "fullscreen": "Fullscreen"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set Fullscreen",
      "displayText": '[b]DEPRECATED[/b] - Set fullscreen state to "{0}" (tag "{1}")',
      "description": "Change fullscreen state",
      "forward": "_SetFullscreen",
      "isDeprecated": true
    },
    "SetFullscreen": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "fullscreen",
          "desc": "Whether to set fullscreen or not.",
          "name": "Fullscreen",
          "type": "combo",
          "items": [
            {
              "normal": "Normal"
            },
            {
              "fullscreen": "Fullscreen"
            }
          ]
        }
      ],
      "listName": "Set Fullscreen",
      "displayText": '[b]DEPRECATED[/b] - Set fullscreen state to "{0}"',
      "description": "Change fullscreen state",
      "forward": "_SetFullscreen",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetFullscreenV2": {
      "category": "window",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "fullscreen",
          "desc": "Whether to set fullscreen or not.",
          "name": "Fullscreen",
          "type": "combo",
          "items": [
            {
              "normal": "Normal"
            },
            {
              "fullscreen": "Fullscreen"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Set Fullscreen",
      "displayText": 'Set fullscreen state to "{0}" (tag {1})',
      "description": "Change fullscreen state",
      "forward": "_SetFullscreen",
      "isDeprecated": false,
      "isAsync": true
    },
    "ActivateAchievementSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "achievement",
          "desc": "The achievement to activate",
          "name": "Achievement",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Activate achievement",
      "displayText": '[b]DEPRECATED[/b] - Activate achievement [b]{0}[/b] (tag "{1}")',
      "description": "Activate a steam achievement",
      "forward": "_ActivateAchievement",
      "isDeprecated": true
    },
    "ActivateAchievement": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "achievement",
          "desc": "The achievement to activate",
          "name": "Achievement",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Activate achievement",
      "displayText": "[b]DEPRECATED[/b] - Activate achievement [b]{0}[/b]",
      "description": "Activate a steam achievement",
      "forward": "_ActivateAchievement",
      "isAsync": true,
      "isDeprecated": true
    },
    "ActivateAchievementV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "achievement",
          "desc": "The achievement to activate",
          "name": "Achievement",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Activate achievement",
      "displayText": "Activate achievement [b]{0}[/b] (tag {1})",
      "description": "Activate a steam achievement",
      "forward": "_ActivateAchievement",
      "isDeprecated": false,
      "isAsync": true
    },
    "ClearAchievementSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "achievement",
          "desc": "The achievement to clear",
          "name": "Achievement",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Clear achievement",
      "displayText": '[b]DEPRECATED[/b] - Clear achievement [b]{0}[/b] (tag "{1}")',
      "description": "Clear a steam achievement",
      "forward": "_ClearAchievement",
      "isDeprecated": true
    },
    "ClearAchievement": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "achievement",
          "desc": "The achievement to clear",
          "name": "Achievement",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Clear achievement",
      "displayText": "[b]DEPRECATED[/b] - Clear achievement [b]{0}[/b]",
      "description": "Clear a steam achievement",
      "forward": "_ClearAchievement",
      "isAsync": true,
      "isDeprecated": true
    },
    "ClearAchievementV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "achievement",
          "desc": "The achievement to clear",
          "name": "Achievement",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Clear achievement",
      "displayText": "Clear achievement [b]{0}[/b] (tag {1})",
      "description": "Clear a steam achievement",
      "forward": "_ClearAchievement",
      "isDeprecated": false,
      "isAsync": true
    },
    "CheckAchievementActivationStateSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "achievement",
          "desc": "The achievement to check",
          "name": "Achievement",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Check achievement activation state",
      "displayText": '[b]DEPRECATED[/b] - Check achievement [b]{0}[/b] activation state (tag "{1}")',
      "description": "Check the activation state of a steam achievement",
      "forward": "_CheckAchievementActivationState",
      "isDeprecated": true
    },
    "CheckAchievementActivationState": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "achievement",
          "desc": "The achievement to check",
          "name": "Achievement",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Check achievement activation state",
      "displayText": "[b]DEPRECATED[/b] - Check achievement [b]{0}[/b] activation state",
      "description": "Check the activation state of a steam achievement",
      "forward": "_CheckAchievementActivationState",
      "isAsync": true,
      "isDeprecated": true
    },
    "CheckAchievementActivationStateV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "achievement",
          "desc": "The achievement to check",
          "name": "Achievement",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Check achievement activation state",
      "displayText": "Check achievement [b]{0}[/b] activation state (tag {1})",
      "description": "Check the activation state of a steam achievement",
      "forward": "_CheckAchievementActivationState",
      "isDeprecated": false,
      "isAsync": true
    },
    "SetRichPresenceSync": {
      "category": "steam",
      "displayText": '[b]DEPRECATED[/b] - Set rich presence {0} to {1} (tag "{2}")',
      "listName": "Set rich presence",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "key",
          "desc": "The key of the rich presence.",
          "name": "Key",
          "type": "string"
        },
        {
          "id": "value",
          "desc": "The value of the rich presence.",
          "name": "Value",
          "type": "string"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "description": "Set the rich presence of the local player.",
      "forward": "_SetRichPresence",
      "isDeprecated": true
    },
    "SetRichPresence": {
      "category": "steam",
      "displayText": "[b]DEPRECATED[/b] - Set rich presence {0} to {1}",
      "listName": "Set rich presence",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "key",
          "desc": "The key of the rich presence.",
          "name": "Key",
          "type": "string"
        },
        {
          "id": "value",
          "desc": "The value of the rich presence.",
          "name": "Value",
          "type": "string"
        }
      ],
      "description": "Set the rich presence of the local player.",
      "forward": "_SetRichPresence",
      "isAsync": true,
      "isDeprecated": true
    },
    "SetRichPresenceV2": {
      "category": "steam",
      "displayText": "Set rich presence {0} to {1} (tag {2})",
      "listName": "Set rich presence",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "key",
          "desc": "The key of the rich presence.",
          "name": "Key",
          "type": "string"
        },
        {
          "id": "value",
          "desc": "The value of the rich presence.",
          "name": "Value",
          "type": "string"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "description": "Set the rich presence of the local player.",
      "forward": "_SetRichPresence",
      "isDeprecated": false,
      "isAsync": true
    },
    "DiscordSetActivitySync": {
      "category": "discord",
      "displayText": '[b]DEPRECATED[/b] - Set activity {0} to {1} ({2}, {3}, {4}, {5}, {6}) (tag "{7}")',
      "listName": "Set activity",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "details",
          "desc": "Activity details",
          "name": "Details",
          "type": "string"
        },
        {
          "id": "state",
          "desc": "The state of the activity (ex: in a party).",
          "name": "State",
          "type": "string"
        },
        {
          "id": "startTimestamp",
          "desc": "The timestamp the activity started (ex: 1742458171).",
          "name": "Start Timestamp",
          "type": "any"
        },
        {
          "id": "largeImageKey",
          "desc": "The key of the large image to display (ex: c3-large).",
          "name": "Large image key",
          "type": "string"
        },
        {
          "id": "largeImageText",
          "desc": "The text displayed when hovering the large image.",
          "name": "Large image text",
          "type": "string"
        },
        {
          "id": "smallImageKey",
          "desc": "The key of the small image to display (ex: c3-small).",
          "name": "Small image key",
          "type": "string"
        },
        {
          "id": "smallImageText",
          "desc": "The text displayed when hovering the small image.",
          "name": "Small image text",
          "type": "string"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "description": "Set the discord activity (aka Rich presence).",
      "forward": "_DiscordSetActivity",
      "isDeprecated": true
    },
    "DiscordSetActivity": {
      "category": "discord",
      "displayText": "[b]DEPRECATED[/b] - Set activity {0} to {1} ({2}, {3}, {4}, {5}, {6})",
      "listName": "Set activity",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "details",
          "desc": "Activity details",
          "name": "Details",
          "type": "string"
        },
        {
          "id": "state",
          "desc": "The state of the activity (ex: in a party).",
          "name": "State",
          "type": "string"
        },
        {
          "id": "startTimestamp",
          "desc": "The timestamp the activity started (ex: 1742458171).",
          "name": "Start Timestamp",
          "type": "any"
        },
        {
          "id": "largeImageKey",
          "desc": "The key of the large image to display (ex: c3-large).",
          "name": "Large image key",
          "type": "string"
        },
        {
          "id": "largeImageText",
          "desc": "The text displayed when hovering the large image.",
          "name": "Large image text",
          "type": "string"
        },
        {
          "id": "smallImageKey",
          "desc": "The key of the small image to display (ex: c3-small).",
          "name": "Small image key",
          "type": "string"
        },
        {
          "id": "smallImageText",
          "desc": "The text displayed when hovering the small image.",
          "name": "Small image text",
          "type": "string"
        }
      ],
      "description": "Set the discord activity (aka Rich presence).",
      "forward": "_DiscordSetActivity",
      "isAsync": true,
      "isDeprecated": true
    },
    "DiscordSetActivityV2": {
      "category": "discord",
      "displayText": "Set activity {0} to {1} ({2}, {3}, {4}, {5}, {6}) (tag {7})",
      "listName": "Set activity",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "details",
          "desc": "Activity details",
          "name": "Details",
          "type": "string"
        },
        {
          "id": "state",
          "desc": "The state of the activity (ex: in a party).",
          "name": "State",
          "type": "string"
        },
        {
          "id": "startTimestamp",
          "desc": "The timestamp the activity started (ex: 1742458171).",
          "name": "Start Timestamp",
          "type": "any"
        },
        {
          "id": "largeImageKey",
          "desc": "The key of the large image to display (ex: c3-large).",
          "name": "Large image key",
          "type": "string"
        },
        {
          "id": "largeImageText",
          "desc": "The text displayed when hovering the large image.",
          "name": "Large image text",
          "type": "string"
        },
        {
          "id": "smallImageKey",
          "desc": "The key of the small image to display (ex: c3-small).",
          "name": "Small image key",
          "type": "string"
        },
        {
          "id": "smallImageText",
          "desc": "The text displayed when hovering the small image.",
          "name": "Small image text",
          "type": "string"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "description": "Set the discord activity (aka Rich presence).",
      "forward": "_DiscordSetActivity",
      "isDeprecated": false,
      "isAsync": true
    },
    "LeaderboardUploadScoreSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "leaderboard",
          "desc": "The leaderboard name",
          "name": "Leaderboard",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "score",
          "desc": "The score to upload",
          "name": "Score",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "uploadType",
          "desc": "Whether to force the score to change, or keep the previous score if it was better?",
          "name": "Upload type",
          "type": "combo",
          "items": [
            {
              "keepBest": "Keep the best"
            },
            {
              "overwrite": "Overwrite"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Upload score",
      "displayText": '[b]DEPRECATED[/b] - Upload score [b]{1}[/b] to leaderboard {0} (type={2}) (tag "{3}")',
      "description": "Upload a score to a leaderboard",
      "forward": "_LeaderboardUploadScore",
      "isDeprecated": true
    },
    "LeaderboardUploadScore": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "leaderboard",
          "desc": "The leaderboard name",
          "name": "Leaderboard",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "score",
          "desc": "The score to upload",
          "name": "Score",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "uploadType",
          "desc": "Whether to force the score to change, or keep the previous score if it was better?",
          "name": "Upload type",
          "type": "combo",
          "items": [
            {
              "keepBest": "Keep the best"
            },
            {
              "overwrite": "Overwrite"
            }
          ]
        }
      ],
      "listName": "Upload score",
      "displayText": "[b]DEPRECATED[/b] - Upload score [b]{1}[/b] to leaderboard {0} (type={2})",
      "description": "Upload a score to a leaderboard",
      "forward": "_LeaderboardUploadScore",
      "isAsync": true,
      "isDeprecated": true
    },
    "LeaderboardUploadScoreV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "leaderboard",
          "desc": "The leaderboard name",
          "name": "Leaderboard",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "score",
          "desc": "The score to upload",
          "name": "Score",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "uploadType",
          "desc": "Whether to force the score to change, or keep the previous score if it was better?",
          "name": "Upload type",
          "type": "combo",
          "items": [
            {
              "keepBest": "Keep the best"
            },
            {
              "overwrite": "Overwrite"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Upload score",
      "displayText": "Upload score [b]{1}[/b] to leaderboard {0} (type={2}) (tag {3})",
      "description": "Upload a score to a leaderboard",
      "forward": "_LeaderboardUploadScore",
      "isDeprecated": false,
      "isAsync": true
    },
    "LeaderboardUploadScoreWithMetadataSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "leaderboard",
          "desc": "The leaderboard name",
          "name": "Leaderboard",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "score",
          "desc": "The score to upload",
          "name": "Score",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "metadata",
          "desc": "The metadata to upload alsong the score",
          "name": "Metadata",
          "type": "object",
          "allowedPluginIds": [
            "Arr"
          ]
        },
        {
          "id": "uploadType",
          "desc": "Whether to force the score to change, or keep the previous score if it was better?",
          "name": "Upload type",
          "type": "combo",
          "items": [
            {
              "keepBest": "Keep the best"
            },
            {
              "overwrite": "Overwrite"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Upload score with metadata",
      "displayText": '[b]DEPRECATED[/b] - Upload score [b]{1}[/b] to leaderboard {0} (type={3}, meta={2}) (tag "{4}")',
      "description": "Upload a score to a leaderboard with metadata",
      "forward": "_LeaderboardUploadScoreWithMetadata",
      "isDeprecated": true
    },
    "LeaderboardUploadScoreWithMetadata": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "leaderboard",
          "desc": "The leaderboard name",
          "name": "Leaderboard",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "score",
          "desc": "The score to upload",
          "name": "Score",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "metadata",
          "desc": "The metadata to upload alsong the score",
          "name": "Metadata",
          "type": "object",
          "allowedPluginIds": [
            "Arr"
          ]
        },
        {
          "id": "uploadType",
          "desc": "Whether to force the score to change, or keep the previous score if it was better?",
          "name": "Upload type",
          "type": "combo",
          "items": [
            {
              "keepBest": "Keep the best"
            },
            {
              "overwrite": "Overwrite"
            }
          ]
        }
      ],
      "listName": "Upload score with metadata",
      "displayText": "[b]DEPRECATED[/b] - Upload score [b]{1}[/b] to leaderboard {0} (type={3}, meta={2})",
      "description": "Upload a score to a leaderboard with metadata",
      "forward": "_LeaderboardUploadScoreWithMetadata",
      "isAsync": true,
      "isDeprecated": true
    },
    "LeaderboardUploadScoreWithMetadataV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "leaderboard",
          "desc": "The leaderboard name",
          "name": "Leaderboard",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "score",
          "desc": "The score to upload",
          "name": "Score",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "metadata",
          "desc": "The metadata to upload alsong the score",
          "name": "Metadata",
          "type": "object",
          "allowedPluginIds": [
            "Arr"
          ]
        },
        {
          "id": "uploadType",
          "desc": "Whether to force the score to change, or keep the previous score if it was better?",
          "name": "Upload type",
          "type": "combo",
          "items": [
            {
              "keepBest": "Keep the best"
            },
            {
              "overwrite": "Overwrite"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Upload score with metadata",
      "displayText": "Upload score [b]{1}[/b] to leaderboard {0} (type={3}, meta={2}) (tag {4})",
      "description": "Upload a score to a leaderboard with metadata",
      "forward": "_LeaderboardUploadScoreWithMetadata",
      "isDeprecated": false,
      "isAsync": true
    },
    "LeaderboardDownloadScoreSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "leaderboard",
          "desc": "The leaderboard name",
          "name": "Leaderboard",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "downloadType",
          "desc": "The type of data you want to query",
          "name": "Download type",
          "type": "combo",
          "items": [
            {
              "regular": "Regular"
            },
            {
              "around": "Around the user"
            },
            {
              "friends": "Friends"
            }
          ]
        },
        {
          "id": "start",
          "desc": "The offset start",
          "name": "Start",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "end",
          "desc": "The offset end",
          "name": "End",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "output",
          "desc": "The output object",
          "name": "Output",
          "type": "object",
          "allowedPluginIds": [
            "Json"
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Download scores",
      "displayText": '[b]DEPRECATED[/b] - Download scores from leaderboard {0} (type={1}, {2}..{3}) into {4} (tag "{5}")',
      "description": "Download scores from a leaderboard\nWhen Download type is Regular, offset are absolute.\nWhen Download type is Around the user, the offsets are the amount of entries around the user to fetch.",
      "forward": "_LeaderboardDownloadScore",
      "isDeprecated": true
    },
    "LeaderboardDownloadScore": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "leaderboard",
          "desc": "The leaderboard name",
          "name": "Leaderboard",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "downloadType",
          "desc": "The type of data you want to query",
          "name": "Download type",
          "type": "combo",
          "items": [
            {
              "regular": "Regular"
            },
            {
              "around": "Around the user"
            },
            {
              "friends": "Friends"
            }
          ]
        },
        {
          "id": "start",
          "desc": "The offset start",
          "name": "Start",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "end",
          "desc": "The offset end",
          "name": "End",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "output",
          "desc": "The output object",
          "name": "Output",
          "type": "object",
          "allowedPluginIds": [
            "Json"
          ]
        }
      ],
      "listName": "Download scores",
      "displayText": "[b]DEPRECATED[/b] - Download scores from leaderboard {0} (type={1}, {2}..{3}) into {4}",
      "description": "Download scores from a leaderboard\nWhen Download type is Regular, offset are absolute.\nWhen Download type is Around the user, the offsets are the amount of entries around the user to fetch.",
      "forward": "_LeaderboardDownloadScore",
      "isAsync": true,
      "isDeprecated": true
    },
    "LeaderboardDownloadScoreV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "leaderboard",
          "desc": "The leaderboard name",
          "name": "Leaderboard",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "downloadType",
          "desc": "The type of data you want to query",
          "name": "Download type",
          "type": "combo",
          "items": [
            {
              "regular": "Regular"
            },
            {
              "around": "Around the user"
            },
            {
              "friends": "Friends"
            }
          ]
        },
        {
          "id": "start",
          "desc": "The offset start",
          "name": "Start",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "end",
          "desc": "The offset end",
          "name": "End",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "output",
          "desc": "The output object",
          "name": "Output",
          "type": "object",
          "allowedPluginIds": [
            "Json"
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Download scores",
      "displayText": "Download scores from leaderboard {0} (type={1}, {2}..{3}) into {4} (tag {5})",
      "description": "Download scores from a leaderboard\nWhen Download type is Regular, offset are absolute.\nWhen Download type is Around the user, the offsets are the amount of entries around the user to fetch.",
      "forward": "_LeaderboardDownloadScore",
      "isDeprecated": false,
      "isAsync": true
    },
    "ActivateToWebPageSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "url",
          "desc": "The webpage to open. A fully qualified address with the protocol is required (e.g. 'http://www.steampowered.com')",
          "name": "URL",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "mode",
          "desc": "Mode for the web page.",
          "name": "Mode",
          "type": "combo",
          "items": [
            {
              "default": "Default"
            },
            {
              "modal": "Modal"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Activate Steam overlay to web page",
      "displayText": '[b]DEPRECATED[/b] - Activate Steam overlay to web page [b]{0}[/b] (mode: {1}) (tag "{2}")',
      "description": "Activates Steam Overlay web browser directly to the specified URL",
      "forward": "_ActivateToWebPage",
      "isDeprecated": true
    },
    "ActivateToWebPage": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "url",
          "desc": "The webpage to open. A fully qualified address with the protocol is required (e.g. 'http://www.steampowered.com')",
          "name": "URL",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "mode",
          "desc": "Mode for the web page.",
          "name": "Mode",
          "type": "combo",
          "items": [
            {
              "default": "Default"
            },
            {
              "modal": "Modal"
            }
          ]
        }
      ],
      "listName": "Activate Steam overlay to web page",
      "displayText": "[b]DEPRECATED[/b] - Activate Steam overlay to web page [b]{0}[/b] (mode: {1})",
      "description": "Activates Steam Overlay web browser directly to the specified URL",
      "forward": "_ActivateToWebPage",
      "isAsync": true,
      "isDeprecated": true
    },
    "ActivateToWebPageV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "url",
          "desc": "The webpage to open. A fully qualified address with the protocol is required (e.g. 'http://www.steampowered.com')",
          "name": "URL",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "mode",
          "desc": "Mode for the web page.",
          "name": "Mode",
          "type": "combo",
          "items": [
            {
              "default": "Default"
            },
            {
              "modal": "Modal"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Activate Steam overlay to web page",
      "displayText": "Activate Steam overlay to web page [b]{0}[/b] (mode: {1}) (tag {2})",
      "description": "Activates Steam Overlay web browser directly to the specified URL",
      "forward": "_ActivateToWebPage",
      "isDeprecated": false,
      "isAsync": true
    },
    "ActivateToStoreSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appId",
          "desc": "The app ID to show the store page of",
          "name": "App ID",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "flag",
          "desc": "Flags to modify the behavior when the page opens",
          "name": "Flag",
          "type": "combo",
          "items": [
            {
              "none": "None"
            },
            {
              "addToCartAndShow": "Add to cart and show"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Activate Steam overlay to store",
      "displayText": '[b]DEPRECATED[/b] - Activate Steam overlay to store for app [b]{0}[/b] (flag: {1}) (tag "{2}")',
      "description": "Activates the Steam Overlay to the Steam store page for the provided app",
      "forward": "_ActivateToStore",
      "isDeprecated": true
    },
    "ActivateToStore": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appId",
          "desc": "The app ID to show the store page of",
          "name": "App ID",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "flag",
          "desc": "Flags to modify the behavior when the page opens",
          "name": "Flag",
          "type": "combo",
          "items": [
            {
              "none": "None"
            },
            {
              "addToCartAndShow": "Add to cart and show"
            }
          ]
        }
      ],
      "listName": "Activate Steam overlay to store",
      "displayText": "[b]DEPRECATED[/b] - Activate Steam overlay to store for app [b]{0}[/b] (flag: {1})",
      "description": "Activates the Steam Overlay to the Steam store page for the provided app",
      "forward": "_ActivateToStore",
      "isAsync": true,
      "isDeprecated": true
    },
    "ActivateToStoreV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appId",
          "desc": "The app ID to show the store page of",
          "name": "App ID",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "flag",
          "desc": "Flags to modify the behavior when the page opens",
          "name": "Flag",
          "type": "combo",
          "items": [
            {
              "none": "None"
            },
            {
              "addToCartAndShow": "Add to cart and show"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Activate Steam overlay to store",
      "displayText": "Activate Steam overlay to store for app [b]{0}[/b] (flag: {1}) (tag {2})",
      "description": "Activates the Steam Overlay to the Steam store page for the provided app",
      "forward": "_ActivateToStore",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetSteamUILanguageSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get Steam UI language",
      "displayText": '[b]DEPRECATED[/b] - Get Steam UI language (tag "{0}")',
      "description": "Get the language of the Steam UI",
      "forward": "_GetSteamUILanguage",
      "isDeprecated": true
    },
    "GetSteamUILanguage": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Get Steam UI language",
      "displayText": "[b]DEPRECATED[/b] - Get Steam UI language",
      "description": "Get the language of the Steam UI",
      "forward": "_GetSteamUILanguage",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetSteamUILanguageV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get Steam UI language",
      "displayText": "Get Steam UI language (tag {0})",
      "description": "Get the language of the Steam UI",
      "forward": "_GetSteamUILanguage",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetAvailableGameLanguagesSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get available game languages",
      "displayText": '[b]DEPRECATED[/b] - Get available game languages (tag "{0}")',
      "description": "Get a list of available languages for the game",
      "forward": "_GetAvailableGameLanguages",
      "isDeprecated": true
    },
    "GetAvailableGameLanguages": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Get available game languages",
      "displayText": "[b]DEPRECATED[/b] - Get available game languages",
      "description": "Get a list of available languages for the game",
      "forward": "_GetAvailableGameLanguages",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetAvailableGameLanguagesV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get available game languages",
      "displayText": "Get available game languages (tag {0})",
      "description": "Get a list of available languages for the game",
      "forward": "_GetAvailableGameLanguages",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetCurrentGameLanguageSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get current game language",
      "displayText": '[b]DEPRECATED[/b] - Get current game language (tag "{0}")',
      "description": "Get the current language of the game",
      "forward": "_GetCurrentGameLanguage",
      "isDeprecated": true
    },
    "GetCurrentGameLanguage": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Get current game language",
      "displayText": "[b]DEPRECATED[/b] - Get current game language",
      "description": "Get the current language of the game",
      "forward": "_GetCurrentGameLanguage",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetCurrentGameLanguageV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get current game language",
      "displayText": "Get current game language (tag {0})",
      "description": "Get the current language of the game",
      "forward": "_GetCurrentGameLanguage",
      "isDeprecated": false,
      "isAsync": true
    },
    "TriggerScreenshotSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Trigger screenshot",
      "displayText": '[b]DEPRECATED[/b] - Trigger Steam screenshot (tag "{0}")',
      "description": "Captures the current screen and saves to Steam screenshot library",
      "forward": "_TriggerScreenshot",
      "isDeprecated": true
    },
    "TriggerScreenshot": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Trigger screenshot",
      "displayText": "[b]DEPRECATED[/b] - Trigger Steam screenshot",
      "description": "Captures the current screen and saves to Steam screenshot library",
      "forward": "_TriggerScreenshot",
      "isAsync": true,
      "isDeprecated": true
    },
    "TriggerScreenshotV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Trigger screenshot",
      "displayText": "Trigger Steam screenshot (tag {0})",
      "description": "Captures the current screen and saves to Steam screenshot library",
      "forward": "_TriggerScreenshot",
      "isDeprecated": false,
      "isAsync": true
    },
    "SaveScreenshotFromURLSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "url",
          "desc": "The URL of the image to save as a screenshot (will be converted to base64)",
          "name": "URL",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Save screenshot from URL",
      "displayText": '[b]DEPRECATED[/b] - Save screenshot from URL [b]{0}[/b] (tag "{1}")',
      "description": "Saves an image from a URL as a Steam screenshot. The image will be loaded, converted to base64, and its dimensions calculated automatically.",
      "forward": "_SaveScreenshotFromURL",
      "isDeprecated": true
    },
    "SaveScreenshotFromURL": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "url",
          "desc": "The URL of the image to save as a screenshot (will be converted to base64)",
          "name": "URL",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Save screenshot from URL",
      "displayText": "[b]DEPRECATED[/b] - Save screenshot from URL [b]{0}[/b]",
      "description": "Saves an image from a URL as a Steam screenshot. The image will be loaded, converted to base64, and its dimensions calculated automatically.",
      "forward": "_SaveScreenshotFromURL",
      "isAsync": true,
      "isDeprecated": true
    },
    "SaveScreenshotFromURLV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "url",
          "desc": "The URL of the image to save as a screenshot (will be converted to base64)",
          "name": "URL",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Save screenshot from URL",
      "displayText": "Save screenshot from URL [b]{0}[/b] (tag {1})",
      "description": "Saves an image from a URL as a Steam screenshot. The image will be loaded, converted to base64, and its dimensions calculated automatically.",
      "forward": "_SaveScreenshotFromURL",
      "isDeprecated": false,
      "isAsync": true
    },
    "AddScreenshotToLibrarySync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "filename",
          "desc": "The absolute path to the screenshot file on disk",
          "name": "Filename",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "thumbnailFilename",
          "desc": "Optional absolute path to a thumbnail file (leave empty for no thumbnail)",
          "name": "Thumbnail Filename",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "width",
          "desc": "The width of the screenshot in pixels",
          "name": "Width",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "height",
          "desc": "The height of the screenshot in pixels",
          "name": "Height",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Add screenshot to library",
      "displayText": '[b]DEPRECATED[/b] - Add screenshot [b]{0}[/b] to library (thumbnail: {1}, size: {2}x{3}) (tag "{4}")',
      "description": "Adds an existing screenshot file to the Steam screenshot library. Returns the handle of the screenshot.",
      "forward": "_AddScreenshotToLibrary",
      "isDeprecated": true
    },
    "AddScreenshotToLibrary": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "filename",
          "desc": "The absolute path to the screenshot file on disk",
          "name": "Filename",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "thumbnailFilename",
          "desc": "Optional absolute path to a thumbnail file (leave empty for no thumbnail)",
          "name": "Thumbnail Filename",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "width",
          "desc": "The width of the screenshot in pixels",
          "name": "Width",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "height",
          "desc": "The height of the screenshot in pixels",
          "name": "Height",
          "type": "number",
          "initialValue": "0"
        }
      ],
      "listName": "Add screenshot to library",
      "displayText": "[b]DEPRECATED[/b] - Add screenshot [b]{0}[/b] to library (thumbnail: {1}, size: {2}x{3})",
      "description": "Adds an existing screenshot file to the Steam screenshot library. Returns the handle of the screenshot.",
      "forward": "_AddScreenshotToLibrary",
      "isAsync": true,
      "isDeprecated": true
    },
    "AddScreenshotToLibraryV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "filename",
          "desc": "The absolute path to the screenshot file on disk",
          "name": "Filename",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "thumbnailFilename",
          "desc": "Optional absolute path to a thumbnail file (leave empty for no thumbnail)",
          "name": "Thumbnail Filename",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "width",
          "desc": "The width of the screenshot in pixels",
          "name": "Width",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "height",
          "desc": "The height of the screenshot in pixels",
          "name": "Height",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Add screenshot to library",
      "displayText": "Add screenshot [b]{0}[/b] to library (thumbnail: {1}, size: {2}x{3}) (tag {4})",
      "description": "Adds an existing screenshot file to the Steam screenshot library. Returns the handle of the screenshot.",
      "forward": "_AddScreenshotToLibrary",
      "isDeprecated": false,
      "isAsync": true
    },
    "CheckDLCIsInstalledSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appId",
          "desc": "The App ID of the DLC to check",
          "name": "DLC App ID",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Check DLC is installed",
      "displayText": '[b]DEPRECATED[/b] - Check DLC [b]{0}[/b] is installed (tag "{1}")',
      "description": "Checks if the user owns and has installed a specific DLC",
      "forward": "_CheckDLCIsInstalled",
      "isDeprecated": true
    },
    "CheckDLCIsInstalled": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appId",
          "desc": "The App ID of the DLC to check",
          "name": "DLC App ID",
          "type": "number",
          "initialValue": "0"
        }
      ],
      "listName": "Check DLC is installed",
      "displayText": "[b]DEPRECATED[/b] - Check DLC [b]{0}[/b] is installed",
      "description": "Checks if the user owns and has installed a specific DLC",
      "forward": "_CheckDLCIsInstalled",
      "isAsync": true,
      "isDeprecated": true
    },
    "CheckDLCIsInstalledV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appId",
          "desc": "The App ID of the DLC to check",
          "name": "DLC App ID",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Check DLC is installed",
      "displayText": "Check DLC [b]{0}[/b] is installed (tag {1})",
      "description": "Checks if the user owns and has installed a specific DLC",
      "forward": "_CheckDLCIsInstalled",
      "isDeprecated": false,
      "isAsync": true
    },
    "ShowGamepadTextInputSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "inputMode",
          "desc": "The input mode for the text entry",
          "name": "Input Mode",
          "type": "combo",
          "items": [
            {
              "normal": "Normal"
            },
            {
              "password": "Password"
            }
          ]
        },
        {
          "id": "inputLineMode",
          "desc": "Whether to use single-line or multi-line input",
          "name": "Line Mode",
          "type": "combo",
          "items": [
            {
              "singleLine": "Single Line"
            },
            {
              "multipleLines": "Multiple Lines"
            }
          ]
        },
        {
          "id": "description",
          "desc": "The description text to display to the user",
          "name": "Description",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "maxCharacters",
          "desc": "The maximum number of characters allowed",
          "name": "Max Characters",
          "type": "number",
          "initialValue": "256"
        },
        {
          "id": "existingText",
          "desc": "Optional existing text to pre-fill in the input (leave empty for none)",
          "name": "Existing Text",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Show gamepad text input",
      "displayText": '[b]DEPRECATED[/b] - Show gamepad text input (mode: {0}, line: {1}, desc: [b]{2}[/b], max: {3}, existing: {4}) (tag "{5}")',
      "description": "Shows the Steam gamepad text input dialog. Returns the entered text, or null if cancelled or could not show.",
      "forward": "_ShowGamepadTextInput",
      "isDeprecated": true
    },
    "ShowGamepadTextInput": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "inputMode",
          "desc": "The input mode for the text entry",
          "name": "Input Mode",
          "type": "combo",
          "items": [
            {
              "normal": "Normal"
            },
            {
              "password": "Password"
            }
          ]
        },
        {
          "id": "inputLineMode",
          "desc": "Whether to use single-line or multi-line input",
          "name": "Line Mode",
          "type": "combo",
          "items": [
            {
              "singleLine": "Single Line"
            },
            {
              "multipleLines": "Multiple Lines"
            }
          ]
        },
        {
          "id": "description",
          "desc": "The description text to display to the user",
          "name": "Description",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "maxCharacters",
          "desc": "The maximum number of characters allowed",
          "name": "Max Characters",
          "type": "number",
          "initialValue": "256"
        },
        {
          "id": "existingText",
          "desc": "Optional existing text to pre-fill in the input (leave empty for none)",
          "name": "Existing Text",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Show gamepad text input",
      "displayText": "[b]DEPRECATED[/b] - Show gamepad text input (mode: {0}, line: {1}, desc: [b]{2}[/b], max: {3}, existing: {4})",
      "description": "Shows the Steam gamepad text input dialog. Returns the entered text, or null if cancelled or could not show.",
      "forward": "_ShowGamepadTextInput",
      "isAsync": true,
      "isDeprecated": true
    },
    "ShowGamepadTextInputV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "inputMode",
          "desc": "The input mode for the text entry",
          "name": "Input Mode",
          "type": "combo",
          "items": [
            {
              "normal": "Normal"
            },
            {
              "password": "Password"
            }
          ]
        },
        {
          "id": "inputLineMode",
          "desc": "Whether to use single-line or multi-line input",
          "name": "Line Mode",
          "type": "combo",
          "items": [
            {
              "singleLine": "Single Line"
            },
            {
              "multipleLines": "Multiple Lines"
            }
          ]
        },
        {
          "id": "description",
          "desc": "The description text to display to the user",
          "name": "Description",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "maxCharacters",
          "desc": "The maximum number of characters allowed",
          "name": "Max Characters",
          "type": "number",
          "initialValue": "256"
        },
        {
          "id": "existingText",
          "desc": "Optional existing text to pre-fill in the input (leave empty for none)",
          "name": "Existing Text",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Show gamepad text input",
      "displayText": "Show gamepad text input (mode: {0}, line: {1}, desc: [b]{2}[/b], max: {3}, existing: {4}) (tag {5})",
      "description": "Shows the Steam gamepad text input dialog. Returns the entered text, or null if cancelled or could not show.",
      "forward": "_ShowGamepadTextInput",
      "isDeprecated": false,
      "isAsync": true
    },
    "ShowFloatingGamepadTextInputSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "keyboardMode",
          "desc": "The keyboard mode to display",
          "name": "Keyboard Mode",
          "type": "combo",
          "items": [
            {
              "singleLine": "Single Line"
            },
            {
              "multipleLines": "Multiple Lines"
            },
            {
              "email": "Email"
            },
            {
              "numeric": "Numeric"
            }
          ]
        },
        {
          "id": "x",
          "desc": "The X position of the floating keyboard",
          "name": "X",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "y",
          "desc": "The Y position of the floating keyboard",
          "name": "Y",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "width",
          "desc": "The width of the floating keyboard",
          "name": "Width",
          "type": "number",
          "initialValue": "800"
        },
        {
          "id": "height",
          "desc": "The height of the floating keyboard",
          "name": "Height",
          "type": "number",
          "initialValue": "600"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Show floating gamepad text input",
      "displayText": '[b]DEPRECATED[/b] - Show floating gamepad text input (mode: {0}, x: {1}, y: {2}, size: {3}x{4}) (tag "{5}")',
      "description": "Shows the Steam floating gamepad text input. Returns true if shown, otherwise false.",
      "forward": "_ShowFloatingGamepadTextInput",
      "isDeprecated": true
    },
    "ShowFloatingGamepadTextInput": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "keyboardMode",
          "desc": "The keyboard mode to display",
          "name": "Keyboard Mode",
          "type": "combo",
          "items": [
            {
              "singleLine": "Single Line"
            },
            {
              "multipleLines": "Multiple Lines"
            },
            {
              "email": "Email"
            },
            {
              "numeric": "Numeric"
            }
          ]
        },
        {
          "id": "x",
          "desc": "The X position of the floating keyboard",
          "name": "X",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "y",
          "desc": "The Y position of the floating keyboard",
          "name": "Y",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "width",
          "desc": "The width of the floating keyboard",
          "name": "Width",
          "type": "number",
          "initialValue": "800"
        },
        {
          "id": "height",
          "desc": "The height of the floating keyboard",
          "name": "Height",
          "type": "number",
          "initialValue": "600"
        }
      ],
      "listName": "Show floating gamepad text input",
      "displayText": "[b]DEPRECATED[/b] - Show floating gamepad text input (mode: {0}, x: {1}, y: {2}, size: {3}x{4})",
      "description": "Shows the Steam floating gamepad text input. Returns true if shown, otherwise false.",
      "forward": "_ShowFloatingGamepadTextInput",
      "isAsync": true,
      "isDeprecated": true
    },
    "ShowFloatingGamepadTextInputV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "keyboardMode",
          "desc": "The keyboard mode to display",
          "name": "Keyboard Mode",
          "type": "combo",
          "items": [
            {
              "singleLine": "Single Line"
            },
            {
              "multipleLines": "Multiple Lines"
            },
            {
              "email": "Email"
            },
            {
              "numeric": "Numeric"
            }
          ]
        },
        {
          "id": "x",
          "desc": "The X position of the floating keyboard",
          "name": "X",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "y",
          "desc": "The Y position of the floating keyboard",
          "name": "Y",
          "type": "number",
          "initialValue": "0"
        },
        {
          "id": "width",
          "desc": "The width of the floating keyboard",
          "name": "Width",
          "type": "number",
          "initialValue": "800"
        },
        {
          "id": "height",
          "desc": "The height of the floating keyboard",
          "name": "Height",
          "type": "number",
          "initialValue": "600"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Show floating gamepad text input",
      "displayText": "Show floating gamepad text input (mode: {0}, x: {1}, y: {2}, size: {3}x{4}) (tag {5})",
      "description": "Shows the Steam floating gamepad text input. Returns true if shown, otherwise false.",
      "forward": "_ShowFloatingGamepadTextInput",
      "isDeprecated": false,
      "isAsync": true
    },
    "CreateWorkshopItemSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appID",
          "desc": "The Steam App ID for the workshop item",
          "name": "App ID",
          "type": "number"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Create workshop item",
      "displayText": '[b]DEPRECATED[/b] - Create workshop item for app [b]{0}[/b] (tag "{1}")',
      "description": "Creates a new workshop item for the specified Steam App ID and returns its ID",
      "forward": "_CreateWorkshopItem",
      "isDeprecated": true
    },
    "CreateWorkshopItem": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appID",
          "desc": "The Steam App ID for the workshop item",
          "name": "App ID",
          "type": "number"
        }
      ],
      "listName": "Create workshop item",
      "displayText": "[b]DEPRECATED[/b] - Create workshop item for app [b]{0}[/b]",
      "description": "Creates a new workshop item for the specified Steam App ID and returns its ID",
      "forward": "_CreateWorkshopItem",
      "isAsync": true,
      "isDeprecated": true
    },
    "CreateWorkshopItemV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appID",
          "desc": "The Steam App ID for the workshop item",
          "name": "App ID",
          "type": "number"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Create workshop item",
      "displayText": "Create workshop item for app [b]{0}[/b] (tag {1})",
      "description": "Creates a new workshop item for the specified Steam App ID and returns its ID",
      "forward": "_CreateWorkshopItem",
      "isDeprecated": false,
      "isAsync": true
    },
    "UpdateWorkshopItemSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appID",
          "desc": "The Steam App ID for the workshop item",
          "name": "App ID",
          "type": "number"
        },
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateTitle",
          "desc": "Whether to update the title",
          "name": "Update Title",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "title",
          "desc": "The title of the workshop item",
          "name": "Title",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateDescription",
          "desc": "Whether to update the description",
          "name": "Update Description",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "description",
          "desc": "The description of the workshop item",
          "name": "Description",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateContent",
          "desc": "Whether to update the content folder",
          "name": "Update Content",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "contentFolderPath",
          "desc": "Absolute path to the folder containing the workshop content",
          "name": "Content Folder Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "changeNote",
          "desc": "Optional change note describing the content update",
          "name": "Change Note",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updatePreview",
          "desc": "Whether to update the preview image",
          "name": "Update Preview",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "previewImagePath",
          "desc": "Absolute path to the preview image file",
          "name": "Preview Image Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateTags",
          "desc": "Whether to update the tags",
          "name": "Update Tags",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "tags",
          "desc": "Comma-separated list of tags",
          "name": "Tags",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateVisibility",
          "desc": "Whether to update the visibility",
          "name": "Update Visibility",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "visibility",
          "desc": "Visibility setting (0=Public, 1=FriendsOnly, 2=Private, 3=Unlisted)",
          "name": "Visibility",
          "type": "combo",
          "items": [
            {
              "public": "Public"
            },
            {
              "friendsOnly": "Friends Only"
            },
            {
              "private": "Private"
            },
            {
              "unlisted": "Unlisted"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Update workshop item",
      "displayText": '[b]DEPRECATED[/b] - Update workshop item [b]{1}[/b] for app [b]{0}[/b] (title: {2} {3}, description: {4} {5}, content: {6} {7} with change note: {8}, preview: {9} {10}, tags: {11} {12}, visibility: {13} {14}) (tag "{15}")',
      "description": "Updates content and metadata of a workshop item. Use the update flags to control which fields are updated.",
      "forward": "_UpdateWorkshopItem",
      "isDeprecated": true
    },
    "UpdateWorkshopItem": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appID",
          "desc": "The Steam App ID for the workshop item",
          "name": "App ID",
          "type": "number"
        },
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateTitle",
          "desc": "Whether to update the title",
          "name": "Update Title",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "title",
          "desc": "The title of the workshop item",
          "name": "Title",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateDescription",
          "desc": "Whether to update the description",
          "name": "Update Description",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "description",
          "desc": "The description of the workshop item",
          "name": "Description",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateContent",
          "desc": "Whether to update the content folder",
          "name": "Update Content",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "contentFolderPath",
          "desc": "Absolute path to the folder containing the workshop content",
          "name": "Content Folder Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "changeNote",
          "desc": "Optional change note describing the content update",
          "name": "Change Note",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updatePreview",
          "desc": "Whether to update the preview image",
          "name": "Update Preview",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "previewImagePath",
          "desc": "Absolute path to the preview image file",
          "name": "Preview Image Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateTags",
          "desc": "Whether to update the tags",
          "name": "Update Tags",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "tags",
          "desc": "Comma-separated list of tags",
          "name": "Tags",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateVisibility",
          "desc": "Whether to update the visibility",
          "name": "Update Visibility",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "visibility",
          "desc": "Visibility setting (0=Public, 1=FriendsOnly, 2=Private, 3=Unlisted)",
          "name": "Visibility",
          "type": "combo",
          "items": [
            {
              "public": "Public"
            },
            {
              "friendsOnly": "Friends Only"
            },
            {
              "private": "Private"
            },
            {
              "unlisted": "Unlisted"
            }
          ]
        }
      ],
      "listName": "Update workshop item",
      "displayText": "[b]DEPRECATED[/b] - Update workshop item [b]{1}[/b] for app [b]{0}[/b] (title: {2} {3}, description: {4} {5}, content: {6} {7} with change note: {8}, preview: {9} {10}, tags: {11} {12}, visibility: {13} {14})",
      "description": "Updates content and metadata of a workshop item. Use the update flags to control which fields are updated.",
      "forward": "_UpdateWorkshopItem",
      "isAsync": true,
      "isDeprecated": true
    },
    "UpdateWorkshopItemV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "appID",
          "desc": "The Steam App ID for the workshop item",
          "name": "App ID",
          "type": "number"
        },
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateTitle",
          "desc": "Whether to update the title",
          "name": "Update Title",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "title",
          "desc": "The title of the workshop item",
          "name": "Title",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateDescription",
          "desc": "Whether to update the description",
          "name": "Update Description",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "description",
          "desc": "The description of the workshop item",
          "name": "Description",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateContent",
          "desc": "Whether to update the content folder",
          "name": "Update Content",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "contentFolderPath",
          "desc": "Absolute path to the folder containing the workshop content",
          "name": "Content Folder Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "changeNote",
          "desc": "Optional change note describing the content update",
          "name": "Change Note",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updatePreview",
          "desc": "Whether to update the preview image",
          "name": "Update Preview",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "previewImagePath",
          "desc": "Absolute path to the preview image file",
          "name": "Preview Image Path",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateTags",
          "desc": "Whether to update the tags",
          "name": "Update Tags",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "tags",
          "desc": "Comma-separated list of tags",
          "name": "Tags",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "updateVisibility",
          "desc": "Whether to update the visibility",
          "name": "Update Visibility",
          "type": "boolean",
          "initialValue": "true"
        },
        {
          "id": "visibility",
          "desc": "Visibility setting (0=Public, 1=FriendsOnly, 2=Private, 3=Unlisted)",
          "name": "Visibility",
          "type": "combo",
          "items": [
            {
              "public": "Public"
            },
            {
              "friendsOnly": "Friends Only"
            },
            {
              "private": "Private"
            },
            {
              "unlisted": "Unlisted"
            }
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Update workshop item",
      "displayText": "Update workshop item [b]{1}[/b] for app [b]{0}[/b] (title: {2} {3}, description: {4} {5}, content: {6} {7} with change note: {8}, preview: {9} {10}, tags: {11} {12}, visibility: {13} {14}) (tag {15})",
      "description": "Updates content and metadata of a workshop item. Use the update flags to control which fields are updated.",
      "forward": "_UpdateWorkshopItem",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetSubscribedItemsWithMetadataSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get subscribed items with metadata",
      "displayText": '[b]DEPRECATED[/b] - Get subscribed items with metadata (tag "{0}")',
      "description": "Gets all subscribed workshop items with their metadata and install info",
      "forward": "_GetSubscribedItemsWithMetadata",
      "isDeprecated": true
    },
    "GetSubscribedItemsWithMetadata": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Get subscribed items with metadata",
      "displayText": "[b]DEPRECATED[/b] - Get subscribed items with metadata",
      "description": "Gets all subscribed workshop items with their metadata and install info",
      "forward": "_GetSubscribedItemsWithMetadata",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetSubscribedItemsWithMetadataV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get subscribed items with metadata",
      "displayText": "Get subscribed items with metadata (tag {0})",
      "description": "Gets all subscribed workshop items with their metadata and install info",
      "forward": "_GetSubscribedItemsWithMetadata",
      "isDeprecated": false,
      "isAsync": true
    },
    "DownloadWorkshopItemSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "highPriority",
          "desc": "Whether to download with high priority",
          "name": "High Priority",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Download workshop item",
      "displayText": '[b]DEPRECATED[/b] - Download workshop item [b]{0}[/b] (priority: {1}) (tag "{2}")',
      "description": "Downloads or updates a workshop item",
      "forward": "_DownloadWorkshopItem",
      "isDeprecated": true
    },
    "DownloadWorkshopItem": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "highPriority",
          "desc": "Whether to download with high priority",
          "name": "High Priority",
          "type": "boolean",
          "initialValue": "false"
        }
      ],
      "listName": "Download workshop item",
      "displayText": "[b]DEPRECATED[/b] - Download workshop item [b]{0}[/b] (priority: {1})",
      "description": "Downloads or updates a workshop item",
      "forward": "_DownloadWorkshopItem",
      "isAsync": true,
      "isDeprecated": true
    },
    "DownloadWorkshopItemV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "highPriority",
          "desc": "Whether to download with high priority",
          "name": "High Priority",
          "type": "boolean",
          "initialValue": "false"
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Download workshop item",
      "displayText": "Download workshop item [b]{0}[/b] (priority: {1}) (tag {2})",
      "description": "Downloads or updates a workshop item",
      "forward": "_DownloadWorkshopItem",
      "isDeprecated": false,
      "isAsync": true
    },
    "DeleteWorkshopItemSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Delete workshop item",
      "displayText": '[b]DEPRECATED[/b] - Delete workshop item [b]{0}[/b] (tag "{1}")',
      "description": "Deletes a workshop item",
      "forward": "_DeleteWorkshopItem",
      "isDeprecated": true
    },
    "DeleteWorkshopItem": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Delete workshop item",
      "displayText": "[b]DEPRECATED[/b] - Delete workshop item [b]{0}[/b]",
      "description": "Deletes a workshop item",
      "forward": "_DeleteWorkshopItem",
      "isAsync": true,
      "isDeprecated": true
    },
    "DeleteWorkshopItemV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Delete workshop item",
      "displayText": "Delete workshop item [b]{0}[/b] (tag {1})",
      "description": "Deletes a workshop item",
      "forward": "_DeleteWorkshopItem",
      "isDeprecated": false,
      "isAsync": true
    },
    "SubscribeWorkshopItemSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Subscribe to workshop item",
      "displayText": '[b]DEPRECATED[/b] - Subscribe to workshop item [b]{0}[/b] (tag "{1}")',
      "description": "Subscribes to a workshop item",
      "forward": "_SubscribeWorkshopItem",
      "isDeprecated": true
    },
    "SubscribeWorkshopItem": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Subscribe to workshop item",
      "displayText": "[b]DEPRECATED[/b] - Subscribe to workshop item [b]{0}[/b]",
      "description": "Subscribes to a workshop item",
      "forward": "_SubscribeWorkshopItem",
      "isAsync": true,
      "isDeprecated": true
    },
    "SubscribeWorkshopItemV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Subscribe to workshop item",
      "displayText": "Subscribe to workshop item [b]{0}[/b] (tag {1})",
      "description": "Subscribes to a workshop item",
      "forward": "_SubscribeWorkshopItem",
      "isDeprecated": false,
      "isAsync": true
    },
    "UnsubscribeWorkshopItemSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Unsubscribe from workshop item",
      "displayText": '[b]DEPRECATED[/b] - Unsubscribe from workshop item [b]{0}[/b] (tag "{1}")',
      "description": "Unsubscribes from a workshop item",
      "forward": "_UnsubscribeWorkshopItem",
      "isDeprecated": true
    },
    "UnsubscribeWorkshopItem": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Unsubscribe from workshop item",
      "displayText": "[b]DEPRECATED[/b] - Unsubscribe from workshop item [b]{0}[/b]",
      "description": "Unsubscribes from a workshop item",
      "forward": "_UnsubscribeWorkshopItem",
      "isAsync": true,
      "isDeprecated": true
    },
    "UnsubscribeWorkshopItemV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Unsubscribe from workshop item",
      "displayText": "Unsubscribe from workshop item [b]{0}[/b] (tag {1})",
      "description": "Unsubscribes from a workshop item",
      "forward": "_UnsubscribeWorkshopItem",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetWorkshopItemStateSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item state",
      "displayText": '[b]DEPRECATED[/b] - Get state of workshop item [b]{0}[/b] (tag "{1}")',
      "description": "Gets the state of a workshop item",
      "forward": "_GetWorkshopItemState",
      "isDeprecated": true
    },
    "GetWorkshopItemState": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item state",
      "displayText": "[b]DEPRECATED[/b] - Get state of workshop item [b]{0}[/b]",
      "description": "Gets the state of a workshop item",
      "forward": "_GetWorkshopItemState",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetWorkshopItemStateV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item state",
      "displayText": "Get state of workshop item [b]{0}[/b] (tag {1})",
      "description": "Gets the state of a workshop item",
      "forward": "_GetWorkshopItemState",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetWorkshopItemInstallInfoSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item install info",
      "displayText": '[b]DEPRECATED[/b] - Get install info of workshop item [b]{0}[/b] (tag "{1}")',
      "description": "Gets the install info of a workshop item",
      "forward": "_GetWorkshopItemInstallInfo",
      "isDeprecated": true
    },
    "GetWorkshopItemInstallInfo": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item install info",
      "displayText": "[b]DEPRECATED[/b] - Get install info of workshop item [b]{0}[/b]",
      "description": "Gets the install info of a workshop item",
      "forward": "_GetWorkshopItemInstallInfo",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetWorkshopItemInstallInfoV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item install info",
      "displayText": "Get install info of workshop item [b]{0}[/b] (tag {1})",
      "description": "Gets the install info of a workshop item",
      "forward": "_GetWorkshopItemInstallInfo",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetWorkshopItemDownloadInfoSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item download info",
      "displayText": '[b]DEPRECATED[/b] - Get download info of workshop item [b]{0}[/b] (tag "{1}")',
      "description": "Gets the download info of a workshop item",
      "forward": "_GetWorkshopItemDownloadInfo",
      "isDeprecated": true
    },
    "GetWorkshopItemDownloadInfo": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item download info",
      "displayText": "[b]DEPRECATED[/b] - Get download info of workshop item [b]{0}[/b]",
      "description": "Gets the download info of a workshop item",
      "forward": "_GetWorkshopItemDownloadInfo",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetWorkshopItemDownloadInfoV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item download info",
      "displayText": "Get download info of workshop item [b]{0}[/b] (tag {1})",
      "description": "Gets the download info of a workshop item",
      "forward": "_GetWorkshopItemDownloadInfo",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetWorkshopItemSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item",
      "displayText": '[b]DEPRECATED[/b] - Get workshop item [b]{0}[/b] (tag "{1}")',
      "description": "Gets a workshop item's metadata",
      "forward": "_GetWorkshopItem",
      "isDeprecated": true
    },
    "GetWorkshopItem": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item",
      "displayText": "[b]DEPRECATED[/b] - Get workshop item [b]{0}[/b]",
      "description": "Gets a workshop item's metadata",
      "forward": "_GetWorkshopItem",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetWorkshopItemV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item",
      "displayText": "Get workshop item [b]{0}[/b] (tag {1})",
      "description": "Gets a workshop item's metadata",
      "forward": "_GetWorkshopItem",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetWorkshopItemsSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemIds",
          "desc": "Comma-separated list of Workshop Item IDs",
          "name": "Item IDs",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop items",
      "displayText": '[b]DEPRECATED[/b] - Get workshop items [b]{0}[/b] (tag "{1}")',
      "description": "Gets multiple workshop items' metadata",
      "forward": "_GetWorkshopItems",
      "isDeprecated": true
    },
    "GetWorkshopItems": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemIds",
          "desc": "Comma-separated list of Workshop Item IDs",
          "name": "Item IDs",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop items",
      "displayText": "[b]DEPRECATED[/b] - Get workshop items [b]{0}[/b]",
      "description": "Gets multiple workshop items' metadata",
      "forward": "_GetWorkshopItems",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetWorkshopItemsV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemIds",
          "desc": "Comma-separated list of Workshop Item IDs",
          "name": "Item IDs",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop items",
      "displayText": "Get workshop items [b]{0}[/b] (tag {1})",
      "description": "Gets multiple workshop items' metadata",
      "forward": "_GetWorkshopItems",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetSubscribedWorkshopItemsSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get subscribed items",
      "displayText": '[b]DEPRECATED[/b] - Get subscribed workshop items (tag "{0}")',
      "description": "Gets all subscribed workshop item IDs",
      "forward": "_GetSubscribedWorkshopItems",
      "isDeprecated": true
    },
    "GetSubscribedWorkshopItems": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "listName": "Get subscribed items",
      "displayText": "[b]DEPRECATED[/b] - Get subscribed workshop items",
      "description": "Gets all subscribed workshop item IDs",
      "forward": "_GetSubscribedWorkshopItems",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetSubscribedWorkshopItemsV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get subscribed items",
      "displayText": "Get subscribed workshop items (tag {0})",
      "description": "Gets all subscribed workshop item IDs",
      "forward": "_GetSubscribedWorkshopItems",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetWorkshopItemWithMetadataSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item with metadata",
      "displayText": '[b]DEPRECATED[/b] - Get workshop item [b]{0}[/b] with metadata (tag "{1}")',
      "description": "Gets a workshop item with its metadata, state, install info, and download info",
      "forward": "_GetWorkshopItemWithMetadata",
      "isDeprecated": true
    },
    "GetWorkshopItemWithMetadata": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item with metadata",
      "displayText": "[b]DEPRECATED[/b] - Get workshop item [b]{0}[/b] with metadata",
      "description": "Gets a workshop item with its metadata, state, install info, and download info",
      "forward": "_GetWorkshopItemWithMetadata",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetWorkshopItemWithMetadataV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemId",
          "desc": "The Workshop Item ID",
          "name": "Item ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop item with metadata",
      "displayText": "Get workshop item [b]{0}[/b] with metadata (tag {1})",
      "description": "Gets a workshop item with its metadata, state, install info, and download info",
      "forward": "_GetWorkshopItemWithMetadata",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetWorkshopItemsWithMetadataSync": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemIds",
          "desc": "Comma-separated list of Workshop Item IDs",
          "name": "Item IDs",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop items with metadata",
      "displayText": '[b]DEPRECATED[/b] - Get workshop items [b]{0}[/b] with metadata (tag "{1}")',
      "description": "Gets multiple workshop items with their metadata, state, install info, and download info",
      "forward": "_GetWorkshopItemsWithMetadata",
      "isDeprecated": true
    },
    "GetWorkshopItemsWithMetadata": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemIds",
          "desc": "Comma-separated list of Workshop Item IDs",
          "name": "Item IDs",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop items with metadata",
      "displayText": "[b]DEPRECATED[/b] - Get workshop items [b]{0}[/b] with metadata",
      "description": "Gets multiple workshop items with their metadata, state, install info, and download info",
      "forward": "_GetWorkshopItemsWithMetadata",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetWorkshopItemsWithMetadataV2": {
      "category": "steam-workshop",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "itemIds",
          "desc": "Comma-separated list of Workshop Item IDs",
          "name": "Item IDs",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get workshop items with metadata",
      "displayText": "Get workshop items [b]{0}[/b] with metadata (tag {1})",
      "description": "Gets multiple workshop items with their metadata, state, install info, and download info",
      "forward": "_GetWorkshopItemsWithMetadata",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetFriendsSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "flags",
          "desc": "The flags to filter friends by.",
          "name": "Flags",
          "type": "combo",
          "items": [
            {
              "none": "None"
            },
            {
              "blocked": "Blocked"
            },
            {
              "friendshipRequested": "Friendship requested"
            },
            {
              "immediate": "Immediate"
            },
            {
              "clanMember": "Clan member"
            },
            {
              "onGameServer": "On game server"
            },
            {
              "requestingFriendship": "Requesting friendship"
            },
            {
              "requestingInfo": "Requesting info"
            },
            {
              "all": "All"
            }
          ]
        },
        {
          "id": "output",
          "desc": "The output object",
          "name": "Output",
          "type": "object",
          "allowedPluginIds": [
            "Json"
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get friends",
      "displayText": '[b]DEPRECATED[/b] - Get friends (flags: {0}) into {1} (tag "{2}")',
      "description": "Get an array of friends matching the provided flags.",
      "forward": "_GetFriends",
      "isDeprecated": true
    },
    "GetFriends": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "flags",
          "desc": "The flags to filter friends by.",
          "name": "Flags",
          "type": "combo",
          "items": [
            {
              "none": "None"
            },
            {
              "blocked": "Blocked"
            },
            {
              "friendshipRequested": "Friendship requested"
            },
            {
              "immediate": "Immediate"
            },
            {
              "clanMember": "Clan member"
            },
            {
              "onGameServer": "On game server"
            },
            {
              "requestingFriendship": "Requesting friendship"
            },
            {
              "requestingInfo": "Requesting info"
            },
            {
              "all": "All"
            }
          ]
        },
        {
          "id": "output",
          "desc": "The output object",
          "name": "Output",
          "type": "object",
          "allowedPluginIds": [
            "Json"
          ]
        }
      ],
      "listName": "Get friends",
      "displayText": "[b]DEPRECATED[/b] - Get friends (flags: {0}) into {1}",
      "description": "Get an array of friends matching the provided flags.",
      "forward": "_GetFriends",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetFriendsV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "flags",
          "desc": "The flags to filter friends by.",
          "name": "Flags",
          "type": "combo",
          "items": [
            {
              "none": "None"
            },
            {
              "blocked": "Blocked"
            },
            {
              "friendshipRequested": "Friendship requested"
            },
            {
              "immediate": "Immediate"
            },
            {
              "clanMember": "Clan member"
            },
            {
              "onGameServer": "On game server"
            },
            {
              "requestingFriendship": "Requesting friendship"
            },
            {
              "requestingInfo": "Requesting info"
            },
            {
              "all": "All"
            }
          ]
        },
        {
          "id": "output",
          "desc": "The output object",
          "name": "Output",
          "type": "object",
          "allowedPluginIds": [
            "Json"
          ]
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get friends",
      "displayText": "Get friends (flags: {0}) into {1} (tag {2})",
      "description": "Get an array of friends matching the provided flags.",
      "forward": "_GetFriends",
      "isDeprecated": false,
      "isAsync": true
    },
    "GetFriendNameSync": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "steamId64",
          "desc": "The Steam ID of the friend.",
          "name": "Steam ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get friend name",
      "displayText": '[b]DEPRECATED[/b] - Get friend name of [b]{0}[/b] (tag "{1}")',
      "description": "Get the persona name of a friend.",
      "forward": "_GetFriendName",
      "isDeprecated": true
    },
    "GetFriendName": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "steamId64",
          "desc": "The Steam ID of the friend.",
          "name": "Steam ID",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get friend name",
      "displayText": "[b]DEPRECATED[/b] - Get friend name of [b]{0}[/b]",
      "description": "Get the persona name of a friend.",
      "forward": "_GetFriendName",
      "isAsync": true,
      "isDeprecated": true
    },
    "GetFriendNameV2": {
      "category": "steam",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "steamId64",
          "desc": "The Steam ID of the friend.",
          "name": "Steam ID",
          "type": "string",
          "initialValue": '""'
        },
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "listName": "Get friend name",
      "displayText": "Get friend name of [b]{0}[/b] (tag {1})",
      "description": "Get the persona name of a friend.",
      "forward": "_GetFriendName",
      "isDeprecated": false,
      "isAsync": true
    }
  },
  "Cnds": {
    "OnInitializeSuccess": {
      "category": "general",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "Initialize" is executed with success.',
      "displayText": 'On "Initialize" success ([b]{0}[/b])',
      "listName": 'On "Initialize" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnInitializeSuccess"
    },
    "OnAnyInitializeSuccess": {
      "category": "general",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "Initialize" are executed with success.',
      "displayText": 'On any "Initialize" success',
      "listName": 'On any "Initialize" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyInitializeSuccess"
    },
    "OnInitializeError": {
      "category": "general",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "Initialize" failed to execute.',
      "displayText": 'On "Initialize" error ([b]{0}[/b])',
      "listName": 'On "Initialize" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnInitializeError"
    },
    "OnAnyInitializeError": {
      "category": "general",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "Initialize" failed to execute.',
      "displayText": 'On any "Initialize" error',
      "listName": 'On any "Initialize" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyInitializeError"
    },
    "OnAppendFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "AppendFile" is executed with success.',
      "displayText": 'On "AppendFile" success ([b]{0}[/b])',
      "listName": 'On "AppendFile" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnAppendFileSuccess"
    },
    "OnAnyAppendFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "AppendFile" are executed with success.',
      "displayText": 'On any "AppendFile" success',
      "listName": 'On any "AppendFile" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyAppendFileSuccess"
    },
    "OnAppendFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "AppendFile" failed to execute.',
      "displayText": 'On "AppendFile" error ([b]{0}[/b])',
      "listName": 'On "AppendFile" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnAppendFileError"
    },
    "OnAnyAppendFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "AppendFile" failed to execute.',
      "displayText": 'On any "AppendFile" error',
      "listName": 'On any "AppendFile" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyAppendFileError"
    },
    "OnCopyFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CopyFile" is executed with success.',
      "displayText": 'On "CopyFile" success ([b]{0}[/b])',
      "listName": 'On "CopyFile" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCopyFileSuccess"
    },
    "OnAnyCopyFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CopyFile" are executed with success.',
      "displayText": 'On any "CopyFile" success',
      "listName": 'On any "CopyFile" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCopyFileSuccess"
    },
    "OnCopyFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CopyFile" failed to execute.',
      "displayText": 'On "CopyFile" error ([b]{0}[/b])',
      "listName": 'On "CopyFile" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCopyFileError"
    },
    "OnAnyCopyFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CopyFile" failed to execute.',
      "displayText": 'On any "CopyFile" error',
      "listName": 'On any "CopyFile" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCopyFileError"
    },
    "OnFetchFileSizeSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "FetchFileSize" is executed with success.',
      "displayText": 'On "FetchFileSize" success ([b]{0}[/b])',
      "listName": 'On "FetchFileSize" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnFetchFileSizeSuccess"
    },
    "OnAnyFetchFileSizeSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "FetchFileSize" are executed with success.',
      "displayText": 'On any "FetchFileSize" success',
      "listName": 'On any "FetchFileSize" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyFetchFileSizeSuccess"
    },
    "OnFetchFileSizeError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "FetchFileSize" failed to execute.',
      "displayText": 'On "FetchFileSize" error ([b]{0}[/b])',
      "listName": 'On "FetchFileSize" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnFetchFileSizeError"
    },
    "OnAnyFetchFileSizeError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "FetchFileSize" failed to execute.',
      "displayText": 'On any "FetchFileSize" error',
      "listName": 'On any "FetchFileSize" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyFetchFileSizeError"
    },
    "OnCreateFolderSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CreateFolder" is executed with success.',
      "displayText": 'On "CreateFolder" success ([b]{0}[/b])',
      "listName": 'On "CreateFolder" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCreateFolderSuccess"
    },
    "OnAnyCreateFolderSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CreateFolder" are executed with success.',
      "displayText": 'On any "CreateFolder" success',
      "listName": 'On any "CreateFolder" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCreateFolderSuccess"
    },
    "OnCreateFolderError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CreateFolder" failed to execute.',
      "displayText": 'On "CreateFolder" error ([b]{0}[/b])',
      "listName": 'On "CreateFolder" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCreateFolderError"
    },
    "OnAnyCreateFolderError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CreateFolder" failed to execute.',
      "displayText": 'On any "CreateFolder" error',
      "listName": 'On any "CreateFolder" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCreateFolderError"
    },
    "OnDeleteFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "DeleteFile" is executed with success.',
      "displayText": 'On "DeleteFile" success ([b]{0}[/b])',
      "listName": 'On "DeleteFile" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnDeleteFileSuccess"
    },
    "OnAnyDeleteFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "DeleteFile" are executed with success.',
      "displayText": 'On any "DeleteFile" success',
      "listName": 'On any "DeleteFile" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyDeleteFileSuccess"
    },
    "OnDeleteFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "DeleteFile" failed to execute.',
      "displayText": 'On "DeleteFile" error ([b]{0}[/b])',
      "listName": 'On "DeleteFile" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnDeleteFileError"
    },
    "OnAnyDeleteFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "DeleteFile" failed to execute.',
      "displayText": 'On any "DeleteFile" error',
      "listName": 'On any "DeleteFile" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyDeleteFileError"
    },
    "OnListFilesSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ListFiles" is executed with success.',
      "displayText": 'On "ListFiles" success ([b]{0}[/b])',
      "listName": 'On "ListFiles" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnListFilesSuccess"
    },
    "OnAnyListFilesSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ListFiles" are executed with success.',
      "displayText": 'On any "ListFiles" success',
      "listName": 'On any "ListFiles" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyListFilesSuccess"
    },
    "OnListFilesError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ListFiles" failed to execute.',
      "displayText": 'On "ListFiles" error ([b]{0}[/b])',
      "listName": 'On "ListFiles" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnListFilesError"
    },
    "OnAnyListFilesError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ListFiles" failed to execute.',
      "displayText": 'On any "ListFiles" error',
      "listName": 'On any "ListFiles" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyListFilesError"
    },
    "OnMoveFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "MoveFile" is executed with success.',
      "displayText": 'On "MoveFile" success ([b]{0}[/b])',
      "listName": 'On "MoveFile" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnMoveFileSuccess"
    },
    "OnAnyMoveFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "MoveFile" are executed with success.',
      "displayText": 'On any "MoveFile" success',
      "listName": 'On any "MoveFile" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyMoveFileSuccess"
    },
    "OnMoveFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "MoveFile" failed to execute.',
      "displayText": 'On "MoveFile" error ([b]{0}[/b])',
      "listName": 'On "MoveFile" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnMoveFileError"
    },
    "OnAnyMoveFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "MoveFile" failed to execute.',
      "displayText": 'On any "MoveFile" error',
      "listName": 'On any "MoveFile" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyMoveFileError"
    },
    "OnOpenBrowserSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "OpenBrowser" is executed with success.',
      "displayText": 'On "OpenBrowser" success ([b]{0}[/b])',
      "listName": 'On "OpenBrowser" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnOpenBrowserSuccess"
    },
    "OnAnyOpenBrowserSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "OpenBrowser" are executed with success.',
      "displayText": 'On any "OpenBrowser" success',
      "listName": 'On any "OpenBrowser" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyOpenBrowserSuccess"
    },
    "OnOpenBrowserError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "OpenBrowser" failed to execute.',
      "displayText": 'On "OpenBrowser" error ([b]{0}[/b])',
      "listName": 'On "OpenBrowser" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnOpenBrowserError"
    },
    "OnAnyOpenBrowserError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "OpenBrowser" failed to execute.',
      "displayText": 'On any "OpenBrowser" error',
      "listName": 'On any "OpenBrowser" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyOpenBrowserError"
    },
    "OnReadBinaryFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ReadBinaryFile" is executed with success.',
      "displayText": 'On "ReadBinaryFile" success ([b]{0}[/b])',
      "listName": 'On "ReadBinaryFile" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnReadBinaryFileSuccess"
    },
    "OnAnyReadBinaryFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ReadBinaryFile" are executed with success.',
      "displayText": 'On any "ReadBinaryFile" success',
      "listName": 'On any "ReadBinaryFile" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyReadBinaryFileSuccess"
    },
    "OnReadBinaryFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ReadBinaryFile" failed to execute.',
      "displayText": 'On "ReadBinaryFile" error ([b]{0}[/b])',
      "listName": 'On "ReadBinaryFile" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnReadBinaryFileError"
    },
    "OnAnyReadBinaryFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ReadBinaryFile" failed to execute.',
      "displayText": 'On any "ReadBinaryFile" error',
      "listName": 'On any "ReadBinaryFile" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyReadBinaryFileError"
    },
    "OnRenameFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "RenameFile" is executed with success.',
      "displayText": 'On "RenameFile" success ([b]{0}[/b])',
      "listName": 'On "RenameFile" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnRenameFileSuccess"
    },
    "OnAnyRenameFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "RenameFile" are executed with success.',
      "displayText": 'On any "RenameFile" success',
      "listName": 'On any "RenameFile" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyRenameFileSuccess"
    },
    "OnRenameFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "RenameFile" failed to execute.',
      "displayText": 'On "RenameFile" error ([b]{0}[/b])',
      "listName": 'On "RenameFile" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnRenameFileError"
    },
    "OnAnyRenameFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "RenameFile" failed to execute.',
      "displayText": 'On any "RenameFile" error',
      "listName": 'On any "RenameFile" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyRenameFileError"
    },
    "OnRunFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "RunFile" is executed with success.',
      "displayText": 'On "RunFile" success ([b]{0}[/b])',
      "listName": 'On "RunFile" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnRunFileSuccess"
    },
    "OnAnyRunFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "RunFile" are executed with success.',
      "displayText": 'On any "RunFile" success',
      "listName": 'On any "RunFile" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyRunFileSuccess"
    },
    "OnRunFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "RunFile" failed to execute.',
      "displayText": 'On "RunFile" error ([b]{0}[/b])',
      "listName": 'On "RunFile" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnRunFileError"
    },
    "OnAnyRunFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "RunFile" failed to execute.',
      "displayText": 'On any "RunFile" error',
      "listName": 'On any "RunFile" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyRunFileError"
    },
    "OnShellOpenSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShellOpen" is executed with success.',
      "displayText": 'On "ShellOpen" success ([b]{0}[/b])',
      "listName": 'On "ShellOpen" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShellOpenSuccess"
    },
    "OnAnyShellOpenSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShellOpen" are executed with success.',
      "displayText": 'On any "ShellOpen" success',
      "listName": 'On any "ShellOpen" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShellOpenSuccess"
    },
    "OnShellOpenError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShellOpen" failed to execute.',
      "displayText": 'On "ShellOpen" error ([b]{0}[/b])',
      "listName": 'On "ShellOpen" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShellOpenError"
    },
    "OnAnyShellOpenError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShellOpen" failed to execute.',
      "displayText": 'On any "ShellOpen" error',
      "listName": 'On any "ShellOpen" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShellOpenError"
    },
    "OnExplorerOpenSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ExplorerOpen" is executed with success.',
      "displayText": 'On "ExplorerOpen" success ([b]{0}[/b])',
      "listName": 'On "ExplorerOpen" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnExplorerOpenSuccess"
    },
    "OnAnyExplorerOpenSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ExplorerOpen" are executed with success.',
      "displayText": 'On any "ExplorerOpen" success',
      "listName": 'On any "ExplorerOpen" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyExplorerOpenSuccess"
    },
    "OnExplorerOpenError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ExplorerOpen" failed to execute.',
      "displayText": 'On "ExplorerOpen" error ([b]{0}[/b])',
      "listName": 'On "ExplorerOpen" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnExplorerOpenError"
    },
    "OnAnyExplorerOpenError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ExplorerOpen" failed to execute.',
      "displayText": 'On any "ExplorerOpen" error',
      "listName": 'On any "ExplorerOpen" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyExplorerOpenError"
    },
    "OnWriteBinaryFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "WriteBinaryFile" is executed with success.',
      "displayText": 'On "WriteBinaryFile" success ([b]{0}[/b])',
      "listName": 'On "WriteBinaryFile" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnWriteBinaryFileSuccess"
    },
    "OnAnyWriteBinaryFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "WriteBinaryFile" are executed with success.',
      "displayText": 'On any "WriteBinaryFile" success',
      "listName": 'On any "WriteBinaryFile" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyWriteBinaryFileSuccess"
    },
    "OnWriteBinaryFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "WriteBinaryFile" failed to execute.',
      "displayText": 'On "WriteBinaryFile" error ([b]{0}[/b])',
      "listName": 'On "WriteBinaryFile" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnWriteBinaryFileError"
    },
    "OnAnyWriteBinaryFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "WriteBinaryFile" failed to execute.',
      "displayText": 'On any "WriteBinaryFile" error',
      "listName": 'On any "WriteBinaryFile" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyWriteBinaryFileError"
    },
    "OnWriteTextFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "WriteTextFile" is executed with success.',
      "displayText": 'On "WriteTextFile" success ([b]{0}[/b])',
      "listName": 'On "WriteTextFile" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnWriteTextFileSuccess"
    },
    "OnAnyWriteTextFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "WriteTextFile" are executed with success.',
      "displayText": 'On any "WriteTextFile" success',
      "listName": 'On any "WriteTextFile" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyWriteTextFileSuccess"
    },
    "OnWriteTextFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "WriteTextFile" failed to execute.',
      "displayText": 'On "WriteTextFile" error ([b]{0}[/b])',
      "listName": 'On "WriteTextFile" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnWriteTextFileError"
    },
    "OnAnyWriteTextFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "WriteTextFile" failed to execute.',
      "displayText": 'On any "WriteTextFile" error',
      "listName": 'On any "WriteTextFile" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyWriteTextFileError"
    },
    "OnWriteTextSuccess": {
      "category": "filesystem",
      "deprecated": true,
      "isDeprecated": true,
      "highlight": false,
      "description": 'Trigger when the "WriteText" is executed with success.',
      "displayText": 'On "WriteText" success ([b]{0}[/b])',
      "listName": 'On "WriteText" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnWriteTextSuccess"
    },
    "OnAnyWriteTextSuccess": {
      "category": "filesystem",
      "deprecated": true,
      "isDeprecated": true,
      "highlight": false,
      "description": 'Trigger when any of the "WriteText" are executed with success.',
      "displayText": 'On any "WriteText" success',
      "listName": 'On any "WriteText" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyWriteTextSuccess"
    },
    "OnWriteTextError": {
      "category": "filesystem",
      "deprecated": true,
      "isDeprecated": true,
      "highlight": false,
      "description": 'Trigger when the "WriteText" failed to execute.',
      "displayText": 'On "WriteText" error ([b]{0}[/b])',
      "listName": 'On "WriteText" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnWriteTextError"
    },
    "OnAnyWriteTextError": {
      "category": "filesystem",
      "deprecated": true,
      "isDeprecated": true,
      "highlight": false,
      "description": 'Trigger when any of the "WriteText" failed to execute.',
      "displayText": 'On any "WriteText" error',
      "listName": 'On any "WriteText" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyWriteTextError"
    },
    "OnReadTextFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ReadTextFile" is executed with success.',
      "displayText": 'On "ReadTextFile" success ([b]{0}[/b])',
      "listName": 'On "ReadTextFile" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnReadTextFileSuccess"
    },
    "OnAnyReadTextFileSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ReadTextFile" are executed with success.',
      "displayText": 'On any "ReadTextFile" success',
      "listName": 'On any "ReadTextFile" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyReadTextFileSuccess"
    },
    "OnReadTextFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ReadTextFile" failed to execute.',
      "displayText": 'On "ReadTextFile" error ([b]{0}[/b])',
      "listName": 'On "ReadTextFile" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnReadTextFileError"
    },
    "OnAnyReadTextFileError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ReadTextFile" failed to execute.',
      "displayText": 'On any "ReadTextFile" error',
      "listName": 'On any "ReadTextFile" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyReadTextFileError"
    },
    "OnCheckIfPathExistSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CheckIfPathExist" is executed with success.',
      "displayText": 'On "CheckIfPathExist" success ([b]{0}[/b])',
      "listName": 'On "CheckIfPathExist" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCheckIfPathExistSuccess"
    },
    "OnAnyCheckIfPathExistSuccess": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CheckIfPathExist" are executed with success.',
      "displayText": 'On any "CheckIfPathExist" success',
      "listName": 'On any "CheckIfPathExist" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCheckIfPathExistSuccess"
    },
    "OnCheckIfPathExistError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CheckIfPathExist" failed to execute.',
      "displayText": 'On "CheckIfPathExist" error ([b]{0}[/b])',
      "listName": 'On "CheckIfPathExist" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCheckIfPathExistError"
    },
    "OnAnyCheckIfPathExistError": {
      "category": "filesystem",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CheckIfPathExist" failed to execute.',
      "displayText": 'On any "CheckIfPathExist" error',
      "listName": 'On any "CheckIfPathExist" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCheckIfPathExistError"
    },
    "OnShowFolderDialogSuccess": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowFolderDialog" is executed with success.',
      "displayText": 'On "ShowFolderDialog" success ([b]{0}[/b])',
      "listName": 'On "ShowFolderDialog" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowFolderDialogSuccess"
    },
    "OnAnyShowFolderDialogSuccess": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowFolderDialog" are executed with success.',
      "displayText": 'On any "ShowFolderDialog" success',
      "listName": 'On any "ShowFolderDialog" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowFolderDialogSuccess"
    },
    "OnShowFolderDialogError": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowFolderDialog" failed to execute.',
      "displayText": 'On "ShowFolderDialog" error ([b]{0}[/b])',
      "listName": 'On "ShowFolderDialog" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowFolderDialogError"
    },
    "OnAnyShowFolderDialogError": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowFolderDialog" failed to execute.',
      "displayText": 'On any "ShowFolderDialog" error',
      "listName": 'On any "ShowFolderDialog" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowFolderDialogError"
    },
    "OnShowOpenDialogSuccess": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowOpenDialog" is executed with success.',
      "displayText": 'On "ShowOpenDialog" success ([b]{0}[/b])',
      "listName": 'On "ShowOpenDialog" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowOpenDialogSuccess"
    },
    "OnAnyShowOpenDialogSuccess": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowOpenDialog" are executed with success.',
      "displayText": 'On any "ShowOpenDialog" success',
      "listName": 'On any "ShowOpenDialog" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowOpenDialogSuccess"
    },
    "OnShowOpenDialogError": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowOpenDialog" failed to execute.',
      "displayText": 'On "ShowOpenDialog" error ([b]{0}[/b])',
      "listName": 'On "ShowOpenDialog" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowOpenDialogError"
    },
    "OnAnyShowOpenDialogError": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowOpenDialog" failed to execute.',
      "displayText": 'On any "ShowOpenDialog" error',
      "listName": 'On any "ShowOpenDialog" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowOpenDialogError"
    },
    "OnShowSaveDialogSuccess": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowSaveDialog" is executed with success.',
      "displayText": 'On "ShowSaveDialog" success ([b]{0}[/b])',
      "listName": 'On "ShowSaveDialog" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowSaveDialogSuccess"
    },
    "OnAnyShowSaveDialogSuccess": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowSaveDialog" are executed with success.',
      "displayText": 'On any "ShowSaveDialog" success',
      "listName": 'On any "ShowSaveDialog" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowSaveDialogSuccess"
    },
    "OnShowSaveDialogError": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowSaveDialog" failed to execute.',
      "displayText": 'On "ShowSaveDialog" error ([b]{0}[/b])',
      "listName": 'On "ShowSaveDialog" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowSaveDialogError"
    },
    "OnAnyShowSaveDialogError": {
      "category": "file-dialogs",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowSaveDialog" failed to execute.',
      "displayText": 'On any "ShowSaveDialog" error',
      "listName": 'On any "ShowSaveDialog" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowSaveDialogError"
    },
    "OnMaximizeSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "Maximize" is executed with success.',
      "displayText": 'On "Maximize" success ([b]{0}[/b])',
      "listName": 'On "Maximize" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnMaximizeSuccess"
    },
    "OnAnyMaximizeSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "Maximize" are executed with success.',
      "displayText": 'On any "Maximize" success',
      "listName": 'On any "Maximize" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyMaximizeSuccess"
    },
    "OnMaximizeError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "Maximize" failed to execute.',
      "displayText": 'On "Maximize" error ([b]{0}[/b])',
      "listName": 'On "Maximize" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnMaximizeError"
    },
    "OnAnyMaximizeError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "Maximize" failed to execute.',
      "displayText": 'On any "Maximize" error',
      "listName": 'On any "Maximize" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyMaximizeError"
    },
    "OnMinimizeSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "Minimize" is executed with success.',
      "displayText": 'On "Minimize" success ([b]{0}[/b])',
      "listName": 'On "Minimize" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnMinimizeSuccess"
    },
    "OnAnyMinimizeSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "Minimize" are executed with success.',
      "displayText": 'On any "Minimize" success',
      "listName": 'On any "Minimize" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyMinimizeSuccess"
    },
    "OnMinimizeError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "Minimize" failed to execute.',
      "displayText": 'On "Minimize" error ([b]{0}[/b])',
      "listName": 'On "Minimize" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnMinimizeError"
    },
    "OnAnyMinimizeError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "Minimize" failed to execute.',
      "displayText": 'On any "Minimize" error',
      "listName": 'On any "Minimize" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyMinimizeError"
    },
    "OnRestoreSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "Restore" is executed with success.',
      "displayText": 'On "Restore" success ([b]{0}[/b])',
      "listName": 'On "Restore" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnRestoreSuccess"
    },
    "OnAnyRestoreSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "Restore" are executed with success.',
      "displayText": 'On any "Restore" success',
      "listName": 'On any "Restore" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyRestoreSuccess"
    },
    "OnRestoreError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "Restore" failed to execute.',
      "displayText": 'On "Restore" error ([b]{0}[/b])',
      "listName": 'On "Restore" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnRestoreError"
    },
    "OnAnyRestoreError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "Restore" failed to execute.',
      "displayText": 'On any "Restore" error',
      "listName": 'On any "Restore" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyRestoreError"
    },
    "OnRequestAttentionSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "RequestAttention" is executed with success.',
      "displayText": 'On "RequestAttention" success ([b]{0}[/b])',
      "listName": 'On "RequestAttention" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnRequestAttentionSuccess"
    },
    "OnAnyRequestAttentionSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "RequestAttention" are executed with success.',
      "displayText": 'On any "RequestAttention" success',
      "listName": 'On any "RequestAttention" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyRequestAttentionSuccess"
    },
    "OnRequestAttentionError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "RequestAttention" failed to execute.',
      "displayText": 'On "RequestAttention" error ([b]{0}[/b])',
      "listName": 'On "RequestAttention" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnRequestAttentionError"
    },
    "OnAnyRequestAttentionError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "RequestAttention" failed to execute.',
      "displayText": 'On any "RequestAttention" error',
      "listName": 'On any "RequestAttention" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyRequestAttentionError"
    },
    "OnSetAlwaysOnTopSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetAlwaysOnTop" is executed with success.',
      "displayText": 'On "SetAlwaysOnTop" success ([b]{0}[/b])',
      "listName": 'On "SetAlwaysOnTop" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetAlwaysOnTopSuccess"
    },
    "OnAnySetAlwaysOnTopSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetAlwaysOnTop" are executed with success.',
      "displayText": 'On any "SetAlwaysOnTop" success',
      "listName": 'On any "SetAlwaysOnTop" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetAlwaysOnTopSuccess"
    },
    "OnSetAlwaysOnTopError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetAlwaysOnTop" failed to execute.',
      "displayText": 'On "SetAlwaysOnTop" error ([b]{0}[/b])',
      "listName": 'On "SetAlwaysOnTop" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetAlwaysOnTopError"
    },
    "OnAnySetAlwaysOnTopError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetAlwaysOnTop" failed to execute.',
      "displayText": 'On any "SetAlwaysOnTop" error',
      "listName": 'On any "SetAlwaysOnTop" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetAlwaysOnTopError"
    },
    "OnSetHeightSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetHeight" is executed with success.',
      "displayText": 'On "SetHeight" success ([b]{0}[/b])',
      "listName": 'On "SetHeight" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetHeightSuccess"
    },
    "OnAnySetHeightSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetHeight" are executed with success.',
      "displayText": 'On any "SetHeight" success',
      "listName": 'On any "SetHeight" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetHeightSuccess"
    },
    "OnSetHeightError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetHeight" failed to execute.',
      "displayText": 'On "SetHeight" error ([b]{0}[/b])',
      "listName": 'On "SetHeight" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetHeightError"
    },
    "OnAnySetHeightError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetHeight" failed to execute.',
      "displayText": 'On any "SetHeight" error',
      "listName": 'On any "SetHeight" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetHeightError"
    },
    "OnSetMaximumSizeSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetMaximumSize" is executed with success.',
      "displayText": 'On "SetMaximumSize" success ([b]{0}[/b])',
      "listName": 'On "SetMaximumSize" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetMaximumSizeSuccess"
    },
    "OnAnySetMaximumSizeSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetMaximumSize" are executed with success.',
      "displayText": 'On any "SetMaximumSize" success',
      "listName": 'On any "SetMaximumSize" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetMaximumSizeSuccess"
    },
    "OnSetMaximumSizeError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetMaximumSize" failed to execute.',
      "displayText": 'On "SetMaximumSize" error ([b]{0}[/b])',
      "listName": 'On "SetMaximumSize" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetMaximumSizeError"
    },
    "OnAnySetMaximumSizeError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetMaximumSize" failed to execute.',
      "displayText": 'On any "SetMaximumSize" error',
      "listName": 'On any "SetMaximumSize" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetMaximumSizeError"
    },
    "OnSetMinimumSizeSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetMinimumSize" is executed with success.',
      "displayText": 'On "SetMinimumSize" success ([b]{0}[/b])',
      "listName": 'On "SetMinimumSize" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetMinimumSizeSuccess"
    },
    "OnAnySetMinimumSizeSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetMinimumSize" are executed with success.',
      "displayText": 'On any "SetMinimumSize" success',
      "listName": 'On any "SetMinimumSize" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetMinimumSizeSuccess"
    },
    "OnSetMinimumSizeError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetMinimumSize" failed to execute.',
      "displayText": 'On "SetMinimumSize" error ([b]{0}[/b])',
      "listName": 'On "SetMinimumSize" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetMinimumSizeError"
    },
    "OnAnySetMinimumSizeError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetMinimumSize" failed to execute.',
      "displayText": 'On any "SetMinimumSize" error',
      "listName": 'On any "SetMinimumSize" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetMinimumSizeError"
    },
    "OnSetResizableSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetResizable" is executed with success.',
      "displayText": 'On "SetResizable" success ([b]{0}[/b])',
      "listName": 'On "SetResizable" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetResizableSuccess"
    },
    "OnAnySetResizableSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetResizable" are executed with success.',
      "displayText": 'On any "SetResizable" success',
      "listName": 'On any "SetResizable" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetResizableSuccess"
    },
    "OnSetResizableError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetResizable" failed to execute.',
      "displayText": 'On "SetResizable" error ([b]{0}[/b])',
      "listName": 'On "SetResizable" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetResizableError"
    },
    "OnAnySetResizableError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetResizable" failed to execute.',
      "displayText": 'On any "SetResizable" error',
      "listName": 'On any "SetResizable" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetResizableError"
    },
    "OnSetTitleSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetTitle" is executed with success.',
      "displayText": 'On "SetTitle" success ([b]{0}[/b])',
      "listName": 'On "SetTitle" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetTitleSuccess"
    },
    "OnAnySetTitleSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetTitle" are executed with success.',
      "displayText": 'On any "SetTitle" success',
      "listName": 'On any "SetTitle" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetTitleSuccess"
    },
    "OnSetTitleError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetTitle" failed to execute.',
      "displayText": 'On "SetTitle" error ([b]{0}[/b])',
      "listName": 'On "SetTitle" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetTitleError"
    },
    "OnAnySetTitleError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetTitle" failed to execute.',
      "displayText": 'On any "SetTitle" error',
      "listName": 'On any "SetTitle" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetTitleError"
    },
    "OnSetWidthSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetWidth" is executed with success.',
      "displayText": 'On "SetWidth" success ([b]{0}[/b])',
      "listName": 'On "SetWidth" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetWidthSuccess"
    },
    "OnAnySetWidthSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetWidth" are executed with success.',
      "displayText": 'On any "SetWidth" success',
      "listName": 'On any "SetWidth" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetWidthSuccess"
    },
    "OnSetWidthError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetWidth" failed to execute.',
      "displayText": 'On "SetWidth" error ([b]{0}[/b])',
      "listName": 'On "SetWidth" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetWidthError"
    },
    "OnAnySetWidthError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetWidth" failed to execute.',
      "displayText": 'On any "SetWidth" error',
      "listName": 'On any "SetWidth" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetWidthError"
    },
    "OnSetXSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetX" is executed with success.',
      "displayText": 'On "SetX" success ([b]{0}[/b])',
      "listName": 'On "SetX" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetXSuccess"
    },
    "OnAnySetXSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetX" are executed with success.',
      "displayText": 'On any "SetX" success',
      "listName": 'On any "SetX" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetXSuccess"
    },
    "OnSetXError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetX" failed to execute.',
      "displayText": 'On "SetX" error ([b]{0}[/b])',
      "listName": 'On "SetX" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetXError"
    },
    "OnAnySetXError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetX" failed to execute.',
      "displayText": 'On any "SetX" error',
      "listName": 'On any "SetX" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetXError"
    },
    "OnSetYSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetY" is executed with success.',
      "displayText": 'On "SetY" success ([b]{0}[/b])',
      "listName": 'On "SetY" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetYSuccess"
    },
    "OnAnySetYSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetY" are executed with success.',
      "displayText": 'On any "SetY" success',
      "listName": 'On any "SetY" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetYSuccess"
    },
    "OnSetYError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetY" failed to execute.',
      "displayText": 'On "SetY" error ([b]{0}[/b])',
      "listName": 'On "SetY" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetYError"
    },
    "OnAnySetYError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetY" failed to execute.',
      "displayText": 'On any "SetY" error',
      "listName": 'On any "SetY" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetYError"
    },
    "OnShowDevToolsSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowDevTools" is executed with success.',
      "displayText": 'On "ShowDevTools" success ([b]{0}[/b])',
      "listName": 'On "ShowDevTools" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowDevToolsSuccess"
    },
    "OnAnyShowDevToolsSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowDevTools" are executed with success.',
      "displayText": 'On any "ShowDevTools" success',
      "listName": 'On any "ShowDevTools" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowDevToolsSuccess"
    },
    "OnShowDevToolsError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowDevTools" failed to execute.',
      "displayText": 'On "ShowDevTools" error ([b]{0}[/b])',
      "listName": 'On "ShowDevTools" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowDevToolsError"
    },
    "OnAnyShowDevToolsError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowDevTools" failed to execute.',
      "displayText": 'On any "ShowDevTools" error',
      "listName": 'On any "ShowDevTools" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowDevToolsError"
    },
    "OnUnmaximizeSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "Unmaximize" is executed with success.',
      "displayText": 'On "Unmaximize" success ([b]{0}[/b])',
      "listName": 'On "Unmaximize" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnUnmaximizeSuccess"
    },
    "OnAnyUnmaximizeSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "Unmaximize" are executed with success.',
      "displayText": 'On any "Unmaximize" success',
      "listName": 'On any "Unmaximize" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyUnmaximizeSuccess"
    },
    "OnUnmaximizeError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "Unmaximize" failed to execute.',
      "displayText": 'On "Unmaximize" error ([b]{0}[/b])',
      "listName": 'On "Unmaximize" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnUnmaximizeError"
    },
    "OnAnyUnmaximizeError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "Unmaximize" failed to execute.',
      "displayText": 'On any "Unmaximize" error',
      "listName": 'On any "Unmaximize" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyUnmaximizeError"
    },
    "OnSetFullscreenSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetFullscreen" is executed with success.',
      "displayText": 'On "SetFullscreen" success ([b]{0}[/b])',
      "listName": 'On "SetFullscreen" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetFullscreenSuccess"
    },
    "OnAnySetFullscreenSuccess": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetFullscreen" are executed with success.',
      "displayText": 'On any "SetFullscreen" success',
      "listName": 'On any "SetFullscreen" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetFullscreenSuccess"
    },
    "OnSetFullscreenError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetFullscreen" failed to execute.',
      "displayText": 'On "SetFullscreen" error ([b]{0}[/b])',
      "listName": 'On "SetFullscreen" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetFullscreenError"
    },
    "OnAnySetFullscreenError": {
      "category": "window",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetFullscreen" failed to execute.',
      "displayText": 'On any "SetFullscreen" error',
      "listName": 'On any "SetFullscreen" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetFullscreenError"
    },
    "OnActivateAchievementSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ActivateAchievement" is executed with success.',
      "displayText": 'On "ActivateAchievement" success ([b]{0}[/b])',
      "listName": 'On "ActivateAchievement" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnActivateAchievementSuccess"
    },
    "OnAnyActivateAchievementSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ActivateAchievement" are executed with success.',
      "displayText": 'On any "ActivateAchievement" success',
      "listName": 'On any "ActivateAchievement" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyActivateAchievementSuccess"
    },
    "OnActivateAchievementError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ActivateAchievement" failed to execute.',
      "displayText": 'On "ActivateAchievement" error ([b]{0}[/b])',
      "listName": 'On "ActivateAchievement" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnActivateAchievementError"
    },
    "OnAnyActivateAchievementError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ActivateAchievement" failed to execute.',
      "displayText": 'On any "ActivateAchievement" error',
      "listName": 'On any "ActivateAchievement" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyActivateAchievementError"
    },
    "OnClearAchievementSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ClearAchievement" is executed with success.',
      "displayText": 'On "ClearAchievement" success ([b]{0}[/b])',
      "listName": 'On "ClearAchievement" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnClearAchievementSuccess"
    },
    "OnAnyClearAchievementSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ClearAchievement" are executed with success.',
      "displayText": 'On any "ClearAchievement" success',
      "listName": 'On any "ClearAchievement" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyClearAchievementSuccess"
    },
    "OnClearAchievementError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ClearAchievement" failed to execute.',
      "displayText": 'On "ClearAchievement" error ([b]{0}[/b])',
      "listName": 'On "ClearAchievement" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnClearAchievementError"
    },
    "OnAnyClearAchievementError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ClearAchievement" failed to execute.',
      "displayText": 'On any "ClearAchievement" error',
      "listName": 'On any "ClearAchievement" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyClearAchievementError"
    },
    "OnCheckAchievementActivationStateSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CheckAchievementActivationState" is executed with success.',
      "displayText": 'On "CheckAchievementActivationState" success ([b]{0}[/b])',
      "listName": 'On "CheckAchievementActivationState" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCheckAchievementActivationStateSuccess"
    },
    "OnAnyCheckAchievementActivationStateSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CheckAchievementActivationState" are executed with success.',
      "displayText": 'On any "CheckAchievementActivationState" success',
      "listName": 'On any "CheckAchievementActivationState" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCheckAchievementActivationStateSuccess"
    },
    "OnCheckAchievementActivationStateError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CheckAchievementActivationState" failed to execute.',
      "displayText": 'On "CheckAchievementActivationState" error ([b]{0}[/b])',
      "listName": 'On "CheckAchievementActivationState" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCheckAchievementActivationStateError"
    },
    "OnAnyCheckAchievementActivationStateError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CheckAchievementActivationState" failed to execute.',
      "displayText": 'On any "CheckAchievementActivationState" error',
      "listName": 'On any "CheckAchievementActivationState" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCheckAchievementActivationStateError"
    },
    "OnSetRichPresenceSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetRichPresence" is executed with success.',
      "displayText": 'On "SetRichPresence" success ([b]{0}[/b])',
      "listName": 'On "SetRichPresence" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetRichPresenceSuccess"
    },
    "OnAnySetRichPresenceSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetRichPresence" are executed with success.',
      "displayText": 'On any "SetRichPresence" success',
      "listName": 'On any "SetRichPresence" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetRichPresenceSuccess"
    },
    "OnSetRichPresenceError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SetRichPresence" failed to execute.',
      "displayText": 'On "SetRichPresence" error ([b]{0}[/b])',
      "listName": 'On "SetRichPresence" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSetRichPresenceError"
    },
    "OnAnySetRichPresenceError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SetRichPresence" failed to execute.',
      "displayText": 'On any "SetRichPresence" error',
      "listName": 'On any "SetRichPresence" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySetRichPresenceError"
    },
    "OnDiscordSetActivitySuccess": {
      "category": "discord",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "DiscordSetActivity" is executed with success.',
      "displayText": 'On "DiscordSetActivity" success ([b]{0}[/b])',
      "listName": 'On "DiscordSetActivity" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnDiscordSetActivitySuccess"
    },
    "OnAnyDiscordSetActivitySuccess": {
      "category": "discord",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "DiscordSetActivity" are executed with success.',
      "displayText": 'On any "DiscordSetActivity" success',
      "listName": 'On any "DiscordSetActivity" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyDiscordSetActivitySuccess"
    },
    "OnDiscordSetActivityError": {
      "category": "discord",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "DiscordSetActivity" failed to execute.',
      "displayText": 'On "DiscordSetActivity" error ([b]{0}[/b])',
      "listName": 'On "DiscordSetActivity" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnDiscordSetActivityError"
    },
    "OnAnyDiscordSetActivityError": {
      "category": "discord",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "DiscordSetActivity" failed to execute.',
      "displayText": 'On any "DiscordSetActivity" error',
      "listName": 'On any "DiscordSetActivity" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyDiscordSetActivityError"
    },
    "OnLeaderboardUploadScoreSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "LeaderboardUploadScore" is executed with success.',
      "displayText": 'On "LeaderboardUploadScore" success ([b]{0}[/b])',
      "listName": 'On "LeaderboardUploadScore" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnLeaderboardUploadScoreSuccess"
    },
    "OnAnyLeaderboardUploadScoreSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "LeaderboardUploadScore" are executed with success.',
      "displayText": 'On any "LeaderboardUploadScore" success',
      "listName": 'On any "LeaderboardUploadScore" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyLeaderboardUploadScoreSuccess"
    },
    "OnLeaderboardUploadScoreError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "LeaderboardUploadScore" failed to execute.',
      "displayText": 'On "LeaderboardUploadScore" error ([b]{0}[/b])',
      "listName": 'On "LeaderboardUploadScore" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnLeaderboardUploadScoreError"
    },
    "OnAnyLeaderboardUploadScoreError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "LeaderboardUploadScore" failed to execute.',
      "displayText": 'On any "LeaderboardUploadScore" error',
      "listName": 'On any "LeaderboardUploadScore" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyLeaderboardUploadScoreError"
    },
    "OnLeaderboardUploadScoreWithMetadataSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "LeaderboardUploadScoreWithMetadata" is executed with success.',
      "displayText": 'On "LeaderboardUploadScoreWithMetadata" success ([b]{0}[/b])',
      "listName": 'On "LeaderboardUploadScoreWithMetadata" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnLeaderboardUploadScoreWithMetadataSuccess"
    },
    "OnAnyLeaderboardUploadScoreWithMetadataSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "LeaderboardUploadScoreWithMetadata" are executed with success.',
      "displayText": 'On any "LeaderboardUploadScoreWithMetadata" success',
      "listName": 'On any "LeaderboardUploadScoreWithMetadata" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyLeaderboardUploadScoreWithMetadataSuccess"
    },
    "OnLeaderboardUploadScoreWithMetadataError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "LeaderboardUploadScoreWithMetadata" failed to execute.',
      "displayText": 'On "LeaderboardUploadScoreWithMetadata" error ([b]{0}[/b])',
      "listName": 'On "LeaderboardUploadScoreWithMetadata" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnLeaderboardUploadScoreWithMetadataError"
    },
    "OnAnyLeaderboardUploadScoreWithMetadataError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "LeaderboardUploadScoreWithMetadata" failed to execute.',
      "displayText": 'On any "LeaderboardUploadScoreWithMetadata" error',
      "listName": 'On any "LeaderboardUploadScoreWithMetadata" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyLeaderboardUploadScoreWithMetadataError"
    },
    "OnLeaderboardDownloadScoreSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "LeaderboardDownloadScore" is executed with success.',
      "displayText": 'On "LeaderboardDownloadScore" success ([b]{0}[/b])',
      "listName": 'On "LeaderboardDownloadScore" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnLeaderboardDownloadScoreSuccess"
    },
    "OnAnyLeaderboardDownloadScoreSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "LeaderboardDownloadScore" are executed with success.',
      "displayText": 'On any "LeaderboardDownloadScore" success',
      "listName": 'On any "LeaderboardDownloadScore" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyLeaderboardDownloadScoreSuccess"
    },
    "OnLeaderboardDownloadScoreError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "LeaderboardDownloadScore" failed to execute.',
      "displayText": 'On "LeaderboardDownloadScore" error ([b]{0}[/b])',
      "listName": 'On "LeaderboardDownloadScore" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnLeaderboardDownloadScoreError"
    },
    "OnAnyLeaderboardDownloadScoreError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "LeaderboardDownloadScore" failed to execute.',
      "displayText": 'On any "LeaderboardDownloadScore" error',
      "listName": 'On any "LeaderboardDownloadScore" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyLeaderboardDownloadScoreError"
    },
    "OnActivateToWebPageSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ActivateToWebPage" is executed with success.',
      "displayText": 'On "ActivateToWebPage" success ([b]{0}[/b])',
      "listName": 'On "ActivateToWebPage" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnActivateToWebPageSuccess"
    },
    "OnAnyActivateToWebPageSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ActivateToWebPage" are executed with success.',
      "displayText": 'On any "ActivateToWebPage" success',
      "listName": 'On any "ActivateToWebPage" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyActivateToWebPageSuccess"
    },
    "OnActivateToWebPageError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ActivateToWebPage" failed to execute.',
      "displayText": 'On "ActivateToWebPage" error ([b]{0}[/b])',
      "listName": 'On "ActivateToWebPage" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnActivateToWebPageError"
    },
    "OnAnyActivateToWebPageError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ActivateToWebPage" failed to execute.',
      "displayText": 'On any "ActivateToWebPage" error',
      "listName": 'On any "ActivateToWebPage" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyActivateToWebPageError"
    },
    "OnActivateToStoreSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ActivateToStore" is executed with success.',
      "displayText": 'On "ActivateToStore" success ([b]{0}[/b])',
      "listName": 'On "ActivateToStore" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnActivateToStoreSuccess"
    },
    "OnAnyActivateToStoreSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ActivateToStore" are executed with success.',
      "displayText": 'On any "ActivateToStore" success',
      "listName": 'On any "ActivateToStore" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyActivateToStoreSuccess"
    },
    "OnActivateToStoreError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ActivateToStore" failed to execute.',
      "displayText": 'On "ActivateToStore" error ([b]{0}[/b])',
      "listName": 'On "ActivateToStore" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnActivateToStoreError"
    },
    "OnAnyActivateToStoreError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ActivateToStore" failed to execute.',
      "displayText": 'On any "ActivateToStore" error',
      "listName": 'On any "ActivateToStore" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyActivateToStoreError"
    },
    "OnGetSteamUILanguageSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetSteamUILanguage" is executed with success.',
      "displayText": 'On "GetSteamUILanguage" success ([b]{0}[/b])',
      "listName": 'On "GetSteamUILanguage" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetSteamUILanguageSuccess"
    },
    "OnAnyGetSteamUILanguageSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetSteamUILanguage" are executed with success.',
      "displayText": 'On any "GetSteamUILanguage" success',
      "listName": 'On any "GetSteamUILanguage" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetSteamUILanguageSuccess"
    },
    "OnGetSteamUILanguageError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetSteamUILanguage" failed to execute.',
      "displayText": 'On "GetSteamUILanguage" error ([b]{0}[/b])',
      "listName": 'On "GetSteamUILanguage" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetSteamUILanguageError"
    },
    "OnAnyGetSteamUILanguageError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetSteamUILanguage" failed to execute.',
      "displayText": 'On any "GetSteamUILanguage" error',
      "listName": 'On any "GetSteamUILanguage" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetSteamUILanguageError"
    },
    "OnGetAvailableGameLanguagesSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetAvailableGameLanguages" is executed with success.',
      "displayText": 'On "GetAvailableGameLanguages" success ([b]{0}[/b])',
      "listName": 'On "GetAvailableGameLanguages" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetAvailableGameLanguagesSuccess"
    },
    "OnAnyGetAvailableGameLanguagesSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetAvailableGameLanguages" are executed with success.',
      "displayText": 'On any "GetAvailableGameLanguages" success',
      "listName": 'On any "GetAvailableGameLanguages" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetAvailableGameLanguagesSuccess"
    },
    "OnGetAvailableGameLanguagesError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetAvailableGameLanguages" failed to execute.',
      "displayText": 'On "GetAvailableGameLanguages" error ([b]{0}[/b])',
      "listName": 'On "GetAvailableGameLanguages" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetAvailableGameLanguagesError"
    },
    "OnAnyGetAvailableGameLanguagesError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetAvailableGameLanguages" failed to execute.',
      "displayText": 'On any "GetAvailableGameLanguages" error',
      "listName": 'On any "GetAvailableGameLanguages" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetAvailableGameLanguagesError"
    },
    "OnGetCurrentGameLanguageSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetCurrentGameLanguage" is executed with success.',
      "displayText": 'On "GetCurrentGameLanguage" success ([b]{0}[/b])',
      "listName": 'On "GetCurrentGameLanguage" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetCurrentGameLanguageSuccess"
    },
    "OnAnyGetCurrentGameLanguageSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetCurrentGameLanguage" are executed with success.',
      "displayText": 'On any "GetCurrentGameLanguage" success',
      "listName": 'On any "GetCurrentGameLanguage" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetCurrentGameLanguageSuccess"
    },
    "OnGetCurrentGameLanguageError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetCurrentGameLanguage" failed to execute.',
      "displayText": 'On "GetCurrentGameLanguage" error ([b]{0}[/b])',
      "listName": 'On "GetCurrentGameLanguage" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetCurrentGameLanguageError"
    },
    "OnAnyGetCurrentGameLanguageError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetCurrentGameLanguage" failed to execute.',
      "displayText": 'On any "GetCurrentGameLanguage" error',
      "listName": 'On any "GetCurrentGameLanguage" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetCurrentGameLanguageError"
    },
    "OnGetFriendsSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetFriends" is executed with success.',
      "displayText": 'On "GetFriends" success ([b]{0}[/b])',
      "listName": 'On "GetFriends" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetFriendsSuccess"
    },
    "OnAnyGetFriendsSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetFriends" are executed with success.',
      "displayText": 'On any "GetFriends" success',
      "listName": 'On any "GetFriends" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetFriendsSuccess"
    },
    "OnGetFriendsError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetFriends" failed to execute.',
      "displayText": 'On "GetFriends" error ([b]{0}[/b])',
      "listName": 'On "GetFriends" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetFriendsError"
    },
    "OnAnyGetFriendsError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetFriends" failed to execute.',
      "displayText": 'On any "GetFriends" error',
      "listName": 'On any "GetFriends" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetFriendsError"
    },
    "OnGetFriendNameSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetFriendName" is executed with success.',
      "displayText": 'On "GetFriendName" success ([b]{0}[/b])',
      "listName": 'On "GetFriendName" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetFriendNameSuccess"
    },
    "OnAnyGetFriendNameSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetFriendName" are executed with success.',
      "displayText": 'On any "GetFriendName" success',
      "listName": 'On any "GetFriendName" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetFriendNameSuccess"
    },
    "OnGetFriendNameError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetFriendName" failed to execute.',
      "displayText": 'On "GetFriendName" error ([b]{0}[/b])',
      "listName": 'On "GetFriendName" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetFriendNameError"
    },
    "OnAnyGetFriendNameError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetFriendName" failed to execute.',
      "displayText": 'On any "GetFriendName" error',
      "listName": 'On any "GetFriendName" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetFriendNameError"
    },
    "OnOverlayActivated": {
      "category": "steam",
      "forward": "_OnOverlayActivated",
      "highlight": false,
      "deprecated": false,
      "description": "Triggered when the Steam overlay is activated.",
      "displayText": "On overlay activated",
      "listName": "On overlay activated",
      "isTrigger": true,
      "params": []
    },
    "OnOverlayDeactivated": {
      "category": "steam",
      "forward": "_OnOverlayDeactivated",
      "highlight": false,
      "deprecated": false,
      "description": "Triggered when the Steam overlay is deactivated.",
      "displayText": "On overlay deactivated",
      "listName": "On overlay deactivated",
      "isTrigger": true,
      "params": []
    },
    "OnTriggerScreenshotSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "TriggerScreenshot" is executed with success.',
      "displayText": 'On "TriggerScreenshot" success ([b]{0}[/b])',
      "listName": 'On "TriggerScreenshot" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnTriggerScreenshotSuccess"
    },
    "OnAnyTriggerScreenshotSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "TriggerScreenshot" are executed with success.',
      "displayText": 'On any "TriggerScreenshot" success',
      "listName": 'On any "TriggerScreenshot" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyTriggerScreenshotSuccess"
    },
    "OnTriggerScreenshotError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "TriggerScreenshot" failed to execute.',
      "displayText": 'On "TriggerScreenshot" error ([b]{0}[/b])',
      "listName": 'On "TriggerScreenshot" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnTriggerScreenshotError"
    },
    "OnAnyTriggerScreenshotError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "TriggerScreenshot" failed to execute.',
      "displayText": 'On any "TriggerScreenshot" error',
      "listName": 'On any "TriggerScreenshot" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyTriggerScreenshotError"
    },
    "OnSaveScreenshotFromURLSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SaveScreenshotFromURL" is executed with success.',
      "displayText": 'On "SaveScreenshotFromURL" success ([b]{0}[/b])',
      "listName": 'On "SaveScreenshotFromURL" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSaveScreenshotFromURLSuccess"
    },
    "OnAnySaveScreenshotFromURLSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SaveScreenshotFromURL" are executed with success.',
      "displayText": 'On any "SaveScreenshotFromURL" success',
      "listName": 'On any "SaveScreenshotFromURL" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySaveScreenshotFromURLSuccess"
    },
    "OnSaveScreenshotFromURLError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SaveScreenshotFromURL" failed to execute.',
      "displayText": 'On "SaveScreenshotFromURL" error ([b]{0}[/b])',
      "listName": 'On "SaveScreenshotFromURL" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSaveScreenshotFromURLError"
    },
    "OnAnySaveScreenshotFromURLError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SaveScreenshotFromURL" failed to execute.',
      "displayText": 'On any "SaveScreenshotFromURL" error',
      "listName": 'On any "SaveScreenshotFromURL" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySaveScreenshotFromURLError"
    },
    "OnAddScreenshotToLibrarySuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "AddScreenshotToLibrary" is executed with success.',
      "displayText": 'On "AddScreenshotToLibrary" success ([b]{0}[/b])',
      "listName": 'On "AddScreenshotToLibrary" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnAddScreenshotToLibrarySuccess"
    },
    "OnAnyAddScreenshotToLibrarySuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "AddScreenshotToLibrary" are executed with success.',
      "displayText": 'On any "AddScreenshotToLibrary" success',
      "listName": 'On any "AddScreenshotToLibrary" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyAddScreenshotToLibrarySuccess"
    },
    "OnAddScreenshotToLibraryError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "AddScreenshotToLibrary" failed to execute.',
      "displayText": 'On "AddScreenshotToLibrary" error ([b]{0}[/b])',
      "listName": 'On "AddScreenshotToLibrary" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnAddScreenshotToLibraryError"
    },
    "OnAnyAddScreenshotToLibraryError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "AddScreenshotToLibrary" failed to execute.',
      "displayText": 'On any "AddScreenshotToLibrary" error',
      "listName": 'On any "AddScreenshotToLibrary" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyAddScreenshotToLibraryError"
    },
    "OnCheckDLCIsInstalledSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CheckDLCIsInstalled" is executed with success.',
      "displayText": 'On "CheckDLCIsInstalled" success ([b]{0}[/b])',
      "listName": 'On "CheckDLCIsInstalled" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCheckDLCIsInstalledSuccess"
    },
    "OnAnyCheckDLCIsInstalledSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CheckDLCIsInstalled" are executed with success.',
      "displayText": 'On any "CheckDLCIsInstalled" success',
      "listName": 'On any "CheckDLCIsInstalled" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCheckDLCIsInstalledSuccess"
    },
    "OnCheckDLCIsInstalledError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CheckDLCIsInstalled" failed to execute.',
      "displayText": 'On "CheckDLCIsInstalled" error ([b]{0}[/b])',
      "listName": 'On "CheckDLCIsInstalled" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCheckDLCIsInstalledError"
    },
    "OnAnyCheckDLCIsInstalledError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CheckDLCIsInstalled" failed to execute.',
      "displayText": 'On any "CheckDLCIsInstalled" error',
      "listName": 'On any "CheckDLCIsInstalled" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCheckDLCIsInstalledError"
    },
    "OnShowGamepadTextInputSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowGamepadTextInput" is executed with success.',
      "displayText": 'On "ShowGamepadTextInput" success ([b]{0}[/b])',
      "listName": 'On "ShowGamepadTextInput" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowGamepadTextInputSuccess"
    },
    "OnAnyShowGamepadTextInputSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowGamepadTextInput" are executed with success.',
      "displayText": 'On any "ShowGamepadTextInput" success',
      "listName": 'On any "ShowGamepadTextInput" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowGamepadTextInputSuccess"
    },
    "OnShowGamepadTextInputError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowGamepadTextInput" failed to execute.',
      "displayText": 'On "ShowGamepadTextInput" error ([b]{0}[/b])',
      "listName": 'On "ShowGamepadTextInput" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowGamepadTextInputError"
    },
    "OnAnyShowGamepadTextInputError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowGamepadTextInput" failed to execute.',
      "displayText": 'On any "ShowGamepadTextInput" error',
      "listName": 'On any "ShowGamepadTextInput" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowGamepadTextInputError"
    },
    "OnShowFloatingGamepadTextInputSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowFloatingGamepadTextInput" is executed with success.',
      "displayText": 'On "ShowFloatingGamepadTextInput" success ([b]{0}[/b])',
      "listName": 'On "ShowFloatingGamepadTextInput" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowFloatingGamepadTextInputSuccess"
    },
    "OnAnyShowFloatingGamepadTextInputSuccess": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowFloatingGamepadTextInput" are executed with success.',
      "displayText": 'On any "ShowFloatingGamepadTextInput" success',
      "listName": 'On any "ShowFloatingGamepadTextInput" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowFloatingGamepadTextInputSuccess"
    },
    "OnShowFloatingGamepadTextInputError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "ShowFloatingGamepadTextInput" failed to execute.',
      "displayText": 'On "ShowFloatingGamepadTextInput" error ([b]{0}[/b])',
      "listName": 'On "ShowFloatingGamepadTextInput" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnShowFloatingGamepadTextInputError"
    },
    "OnAnyShowFloatingGamepadTextInputError": {
      "category": "steam",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "ShowFloatingGamepadTextInput" failed to execute.',
      "displayText": 'On any "ShowFloatingGamepadTextInput" error',
      "listName": 'On any "ShowFloatingGamepadTextInput" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyShowFloatingGamepadTextInputError"
    },
    "OnCreateWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CreateWorkshopItem" is executed with success.',
      "displayText": 'On "CreateWorkshopItem" success ([b]{0}[/b])',
      "listName": 'On "CreateWorkshopItem" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCreateWorkshopItemSuccess"
    },
    "OnAnyCreateWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CreateWorkshopItem" are executed with success.',
      "displayText": 'On any "CreateWorkshopItem" success',
      "listName": 'On any "CreateWorkshopItem" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCreateWorkshopItemSuccess"
    },
    "OnCreateWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "CreateWorkshopItem" failed to execute.',
      "displayText": 'On "CreateWorkshopItem" error ([b]{0}[/b])',
      "listName": 'On "CreateWorkshopItem" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnCreateWorkshopItemError"
    },
    "OnAnyCreateWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "CreateWorkshopItem" failed to execute.',
      "displayText": 'On any "CreateWorkshopItem" error',
      "listName": 'On any "CreateWorkshopItem" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyCreateWorkshopItemError"
    },
    "OnUpdateWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "UpdateWorkshopItem" is executed with success.',
      "displayText": 'On "UpdateWorkshopItem" success ([b]{0}[/b])',
      "listName": 'On "UpdateWorkshopItem" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnUpdateWorkshopItemSuccess"
    },
    "OnAnyUpdateWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "UpdateWorkshopItem" are executed with success.',
      "displayText": 'On any "UpdateWorkshopItem" success',
      "listName": 'On any "UpdateWorkshopItem" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyUpdateWorkshopItemSuccess"
    },
    "OnUpdateWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "UpdateWorkshopItem" failed to execute.',
      "displayText": 'On "UpdateWorkshopItem" error ([b]{0}[/b])',
      "listName": 'On "UpdateWorkshopItem" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnUpdateWorkshopItemError"
    },
    "OnAnyUpdateWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "UpdateWorkshopItem" failed to execute.',
      "displayText": 'On any "UpdateWorkshopItem" error',
      "listName": 'On any "UpdateWorkshopItem" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyUpdateWorkshopItemError"
    },
    "OnGetSubscribedItemsWithMetadataSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetSubscribedItemsWithMetadata" is executed with success.',
      "displayText": 'On "GetSubscribedItemsWithMetadata" success ([b]{0}[/b])',
      "listName": 'On "GetSubscribedItemsWithMetadata" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetSubscribedItemsWithMetadataSuccess"
    },
    "OnAnyGetSubscribedItemsWithMetadataSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetSubscribedItemsWithMetadata" are executed with success.',
      "displayText": 'On any "GetSubscribedItemsWithMetadata" success',
      "listName": 'On any "GetSubscribedItemsWithMetadata" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetSubscribedItemsWithMetadataSuccess"
    },
    "OnGetSubscribedItemsWithMetadataError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetSubscribedItemsWithMetadata" failed to execute.',
      "displayText": 'On "GetSubscribedItemsWithMetadata" error ([b]{0}[/b])',
      "listName": 'On "GetSubscribedItemsWithMetadata" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetSubscribedItemsWithMetadataError"
    },
    "OnAnyGetSubscribedItemsWithMetadataError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetSubscribedItemsWithMetadata" failed to execute.',
      "displayText": 'On any "GetSubscribedItemsWithMetadata" error',
      "listName": 'On any "GetSubscribedItemsWithMetadata" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetSubscribedItemsWithMetadataError"
    },
    "OnDownloadWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "DownloadWorkshopItem" is executed with success.',
      "displayText": 'On "DownloadWorkshopItem" success ([b]{0}[/b])',
      "listName": 'On "DownloadWorkshopItem" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnDownloadWorkshopItemSuccess"
    },
    "OnAnyDownloadWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "DownloadWorkshopItem" are executed with success.',
      "displayText": 'On any "DownloadWorkshopItem" success',
      "listName": 'On any "DownloadWorkshopItem" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyDownloadWorkshopItemSuccess"
    },
    "OnDownloadWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "DownloadWorkshopItem" failed to execute.',
      "displayText": 'On "DownloadWorkshopItem" error ([b]{0}[/b])',
      "listName": 'On "DownloadWorkshopItem" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnDownloadWorkshopItemError"
    },
    "OnAnyDownloadWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "DownloadWorkshopItem" failed to execute.',
      "displayText": 'On any "DownloadWorkshopItem" error',
      "listName": 'On any "DownloadWorkshopItem" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyDownloadWorkshopItemError"
    },
    "OnDeleteWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "DeleteWorkshopItem" is executed with success.',
      "displayText": 'On "DeleteWorkshopItem" success ([b]{0}[/b])',
      "listName": 'On "DeleteWorkshopItem" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnDeleteWorkshopItemSuccess"
    },
    "OnAnyDeleteWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "DeleteWorkshopItem" are executed with success.',
      "displayText": 'On any "DeleteWorkshopItem" success',
      "listName": 'On any "DeleteWorkshopItem" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyDeleteWorkshopItemSuccess"
    },
    "OnDeleteWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "DeleteWorkshopItem" failed to execute.',
      "displayText": 'On "DeleteWorkshopItem" error ([b]{0}[/b])',
      "listName": 'On "DeleteWorkshopItem" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnDeleteWorkshopItemError"
    },
    "OnAnyDeleteWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "DeleteWorkshopItem" failed to execute.',
      "displayText": 'On any "DeleteWorkshopItem" error',
      "listName": 'On any "DeleteWorkshopItem" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyDeleteWorkshopItemError"
    },
    "OnSubscribeWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SubscribeWorkshopItem" is executed with success.',
      "displayText": 'On "SubscribeWorkshopItem" success ([b]{0}[/b])',
      "listName": 'On "SubscribeWorkshopItem" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSubscribeWorkshopItemSuccess"
    },
    "OnAnySubscribeWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SubscribeWorkshopItem" are executed with success.',
      "displayText": 'On any "SubscribeWorkshopItem" success',
      "listName": 'On any "SubscribeWorkshopItem" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySubscribeWorkshopItemSuccess"
    },
    "OnSubscribeWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "SubscribeWorkshopItem" failed to execute.',
      "displayText": 'On "SubscribeWorkshopItem" error ([b]{0}[/b])',
      "listName": 'On "SubscribeWorkshopItem" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnSubscribeWorkshopItemError"
    },
    "OnAnySubscribeWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "SubscribeWorkshopItem" failed to execute.',
      "displayText": 'On any "SubscribeWorkshopItem" error',
      "listName": 'On any "SubscribeWorkshopItem" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnySubscribeWorkshopItemError"
    },
    "OnUnsubscribeWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "UnsubscribeWorkshopItem" is executed with success.',
      "displayText": 'On "UnsubscribeWorkshopItem" success ([b]{0}[/b])',
      "listName": 'On "UnsubscribeWorkshopItem" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnUnsubscribeWorkshopItemSuccess"
    },
    "OnAnyUnsubscribeWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "UnsubscribeWorkshopItem" are executed with success.',
      "displayText": 'On any "UnsubscribeWorkshopItem" success',
      "listName": 'On any "UnsubscribeWorkshopItem" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyUnsubscribeWorkshopItemSuccess"
    },
    "OnUnsubscribeWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "UnsubscribeWorkshopItem" failed to execute.',
      "displayText": 'On "UnsubscribeWorkshopItem" error ([b]{0}[/b])',
      "listName": 'On "UnsubscribeWorkshopItem" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnUnsubscribeWorkshopItemError"
    },
    "OnAnyUnsubscribeWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "UnsubscribeWorkshopItem" failed to execute.',
      "displayText": 'On any "UnsubscribeWorkshopItem" error',
      "listName": 'On any "UnsubscribeWorkshopItem" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyUnsubscribeWorkshopItemError"
    },
    "OnGetWorkshopItemStateSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItemState" is executed with success.',
      "displayText": 'On "GetWorkshopItemState" success ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItemState" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemStateSuccess"
    },
    "OnAnyGetWorkshopItemStateSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItemState" are executed with success.',
      "displayText": 'On any "GetWorkshopItemState" success',
      "listName": 'On any "GetWorkshopItemState" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemStateSuccess"
    },
    "OnGetWorkshopItemStateError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItemState" failed to execute.',
      "displayText": 'On "GetWorkshopItemState" error ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItemState" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemStateError"
    },
    "OnAnyGetWorkshopItemStateError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItemState" failed to execute.',
      "displayText": 'On any "GetWorkshopItemState" error',
      "listName": 'On any "GetWorkshopItemState" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemStateError"
    },
    "OnGetWorkshopItemInstallInfoSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItemInstallInfo" is executed with success.',
      "displayText": 'On "GetWorkshopItemInstallInfo" success ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItemInstallInfo" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemInstallInfoSuccess"
    },
    "OnAnyGetWorkshopItemInstallInfoSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItemInstallInfo" are executed with success.',
      "displayText": 'On any "GetWorkshopItemInstallInfo" success',
      "listName": 'On any "GetWorkshopItemInstallInfo" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemInstallInfoSuccess"
    },
    "OnGetWorkshopItemInstallInfoError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItemInstallInfo" failed to execute.',
      "displayText": 'On "GetWorkshopItemInstallInfo" error ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItemInstallInfo" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemInstallInfoError"
    },
    "OnAnyGetWorkshopItemInstallInfoError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItemInstallInfo" failed to execute.',
      "displayText": 'On any "GetWorkshopItemInstallInfo" error',
      "listName": 'On any "GetWorkshopItemInstallInfo" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemInstallInfoError"
    },
    "OnGetWorkshopItemDownloadInfoSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItemDownloadInfo" is executed with success.',
      "displayText": 'On "GetWorkshopItemDownloadInfo" success ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItemDownloadInfo" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemDownloadInfoSuccess"
    },
    "OnAnyGetWorkshopItemDownloadInfoSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItemDownloadInfo" are executed with success.',
      "displayText": 'On any "GetWorkshopItemDownloadInfo" success',
      "listName": 'On any "GetWorkshopItemDownloadInfo" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemDownloadInfoSuccess"
    },
    "OnGetWorkshopItemDownloadInfoError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItemDownloadInfo" failed to execute.',
      "displayText": 'On "GetWorkshopItemDownloadInfo" error ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItemDownloadInfo" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemDownloadInfoError"
    },
    "OnAnyGetWorkshopItemDownloadInfoError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItemDownloadInfo" failed to execute.',
      "displayText": 'On any "GetWorkshopItemDownloadInfo" error',
      "listName": 'On any "GetWorkshopItemDownloadInfo" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemDownloadInfoError"
    },
    "OnGetWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItem" is executed with success.',
      "displayText": 'On "GetWorkshopItem" success ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItem" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemSuccess"
    },
    "OnAnyGetWorkshopItemSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItem" are executed with success.',
      "displayText": 'On any "GetWorkshopItem" success',
      "listName": 'On any "GetWorkshopItem" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemSuccess"
    },
    "OnGetWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItem" failed to execute.',
      "displayText": 'On "GetWorkshopItem" error ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItem" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemError"
    },
    "OnAnyGetWorkshopItemError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItem" failed to execute.',
      "displayText": 'On any "GetWorkshopItem" error',
      "listName": 'On any "GetWorkshopItem" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemError"
    },
    "OnGetWorkshopItemsSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItems" is executed with success.',
      "displayText": 'On "GetWorkshopItems" success ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItems" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemsSuccess"
    },
    "OnAnyGetWorkshopItemsSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItems" are executed with success.',
      "displayText": 'On any "GetWorkshopItems" success',
      "listName": 'On any "GetWorkshopItems" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemsSuccess"
    },
    "OnGetWorkshopItemsError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItems" failed to execute.',
      "displayText": 'On "GetWorkshopItems" error ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItems" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemsError"
    },
    "OnAnyGetWorkshopItemsError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItems" failed to execute.',
      "displayText": 'On any "GetWorkshopItems" error',
      "listName": 'On any "GetWorkshopItems" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemsError"
    },
    "OnGetSubscribedWorkshopItemsSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetSubscribedWorkshopItems" is executed with success.',
      "displayText": 'On "GetSubscribedWorkshopItems" success ([b]{0}[/b])',
      "listName": 'On "GetSubscribedWorkshopItems" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetSubscribedWorkshopItemsSuccess"
    },
    "OnAnyGetSubscribedWorkshopItemsSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetSubscribedWorkshopItems" are executed with success.',
      "displayText": 'On any "GetSubscribedWorkshopItems" success',
      "listName": 'On any "GetSubscribedWorkshopItems" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetSubscribedWorkshopItemsSuccess"
    },
    "OnGetSubscribedWorkshopItemsError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetSubscribedWorkshopItems" failed to execute.',
      "displayText": 'On "GetSubscribedWorkshopItems" error ([b]{0}[/b])',
      "listName": 'On "GetSubscribedWorkshopItems" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetSubscribedWorkshopItemsError"
    },
    "OnAnyGetSubscribedWorkshopItemsError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetSubscribedWorkshopItems" failed to execute.',
      "displayText": 'On any "GetSubscribedWorkshopItems" error',
      "listName": 'On any "GetSubscribedWorkshopItems" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetSubscribedWorkshopItemsError"
    },
    "OnGetWorkshopItemWithMetadataSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItemWithMetadata" is executed with success.',
      "displayText": 'On "GetWorkshopItemWithMetadata" success ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItemWithMetadata" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemWithMetadataSuccess"
    },
    "OnAnyGetWorkshopItemWithMetadataSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItemWithMetadata" are executed with success.',
      "displayText": 'On any "GetWorkshopItemWithMetadata" success',
      "listName": 'On any "GetWorkshopItemWithMetadata" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemWithMetadataSuccess"
    },
    "OnGetWorkshopItemWithMetadataError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItemWithMetadata" failed to execute.',
      "displayText": 'On "GetWorkshopItemWithMetadata" error ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItemWithMetadata" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemWithMetadataError"
    },
    "OnAnyGetWorkshopItemWithMetadataError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItemWithMetadata" failed to execute.',
      "displayText": 'On any "GetWorkshopItemWithMetadata" error',
      "listName": 'On any "GetWorkshopItemWithMetadata" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemWithMetadataError"
    },
    "OnGetWorkshopItemsWithMetadataSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItemsWithMetadata" is executed with success.',
      "displayText": 'On "GetWorkshopItemsWithMetadata" success ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItemsWithMetadata" success',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemsWithMetadataSuccess"
    },
    "OnAnyGetWorkshopItemsWithMetadataSuccess": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItemsWithMetadata" are executed with success.',
      "displayText": 'On any "GetWorkshopItemsWithMetadata" success',
      "listName": 'On any "GetWorkshopItemsWithMetadata" success',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemsWithMetadataSuccess"
    },
    "OnGetWorkshopItemsWithMetadataError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when the "GetWorkshopItemsWithMetadata" failed to execute.',
      "displayText": 'On "GetWorkshopItemsWithMetadata" error ([b]{0}[/b])',
      "listName": 'On "GetWorkshopItemsWithMetadata" error',
      "params": [
        {
          "id": "tag",
          "desc": "The tag",
          "name": "Tag",
          "type": "string",
          "initialValue": '""'
        }
      ],
      "isTrigger": true,
      "forward": "_OnGetWorkshopItemsWithMetadataError"
    },
    "OnAnyGetWorkshopItemsWithMetadataError": {
      "category": "steam-workshop",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "description": 'Trigger when any of the "GetWorkshopItemsWithMetadata" failed to execute.',
      "displayText": 'On any "GetWorkshopItemsWithMetadata" error',
      "listName": 'On any "GetWorkshopItemsWithMetadata" error',
      "params": [],
      "isTrigger": true,
      "forward": "_OnAnyGetWorkshopItemsWithMetadataError"
    },
    "IsEngine": {
      "category": "general",
      "forward": "_IsEngine",
      "highlight": false,
      "deprecated": false,
      "description": "Return true if the engine running the app is the one selected",
      "displayText": "Is engine {0}",
      "params": [
        {
          "id": "engine",
          "desc": "The engine to check",
          "name": "Engine",
          "type": "combo",
          "items": [
            {
              "electron": "Electron"
            },
            {
              "tauri": "Tauri"
            }
          ]
        }
      ],
      "listName": "Is engine"
    },
    "IsPipelab": {
      "category": "general",
      "forward": "_IsPipelab",
      "highlight": true,
      "deprecated": false,
      "description": "Return true if the Pipelab is used to run the game",
      "displayText": "Is Pipelab",
      "params": [],
      "listName": "Is Pipelab"
    },
    "IsInitialized": {
      "category": "general",
      "forward": "_IsInitialized",
      "highlight": false,
      "deprecated": false,
      "description": "Returns true if the Pipelab integration has been initialized",
      "displayText": "Is initialized",
      "listName": "Is initialized",
      "isInvertible": true,
      "isTrigger": false,
      "params": []
    },
    "IsFullScreen": {
      "category": "window",
      "forward": "_IsFullScreen",
      "highlight": false,
      "deprecated": false,
      "params": [
        {
          "id": "state",
          "desc": "The state to check.",
          "name": "State",
          "type": "combo",
          "items": [
            {
              "normal": "Normal"
            },
            {
              "fullscreen": "Fullscreen"
            }
          ]
        }
      ],
      "description": "Returns true if the window is in full screen mode.",
      "displayText": "Is full screen {0}",
      "listName": "Is full screen",
      "isInvertible": true,
      "isTrigger": false
    },
    "LastCheckedPathExists": {
      "category": "filesystem",
      "forward": "_LastCheckedPathExists",
      "highlight": false,
      "deprecated": false,
      "params": [],
      "description": "Returns true if the last checked path exists.",
      "displayText": "Last checked path exists",
      "listName": "Last checked path exists",
      "isInvertible": true,
      "isTrigger": false
    },
    "IsOverlayActive": {
      "category": "steam",
      "forward": "_IsOverlayActive",
      "highlight": false,
      "isInvertible": true,
      "displayText": "Is overlay active",
      "listName": "Is overlay active",
      "params": [],
      "description": "Return true if the Steam overlay is currently active."
    }
  },
  "Exps": {
    "InitializeError": {
      "category": "general",
      "description": 'The error of the "Initialize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_InitializeError",
      "params": []
    },
    "InitializeResult": {
      "category": "general",
      "description": 'The result of the "Initialize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_InitializeResult",
      "params": []
    },
    "AppendFileError": {
      "category": "filesystem",
      "description": 'The error of the "AppendFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_AppendFileError",
      "params": []
    },
    "AppendFileResult": {
      "category": "filesystem",
      "description": 'The result of the "AppendFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_AppendFileResult",
      "params": []
    },
    "CopyFileError": {
      "category": "filesystem",
      "description": 'The error of the "CopyFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CopyFileError",
      "params": []
    },
    "CopyFileResult": {
      "category": "filesystem",
      "description": 'The result of the "CopyFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CopyFileResult",
      "params": []
    },
    "FetchFileSizeError": {
      "category": "filesystem",
      "description": 'The error of the "FetchFileSize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_FetchFileSizeError",
      "params": []
    },
    "FetchFileSizeResult": {
      "category": "filesystem",
      "description": 'The result of the "FetchFileSize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_FetchFileSizeResult",
      "params": []
    },
    "CreateFolderError": {
      "category": "filesystem",
      "description": 'The error of the "CreateFolder last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CreateFolderError",
      "params": []
    },
    "CreateFolderResult": {
      "category": "filesystem",
      "description": 'The result of the "CreateFolder last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CreateFolderResult",
      "params": []
    },
    "DeleteFileError": {
      "category": "filesystem",
      "description": 'The error of the "DeleteFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_DeleteFileError",
      "params": []
    },
    "DeleteFileResult": {
      "category": "filesystem",
      "description": 'The result of the "DeleteFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_DeleteFileResult",
      "params": []
    },
    "ListFilesError": {
      "category": "filesystem",
      "description": 'The error of the "ListFiles last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ListFilesError",
      "params": []
    },
    "ListFilesResult": {
      "category": "filesystem",
      "description": 'The result of the "ListFiles last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ListFilesResult",
      "params": []
    },
    "MoveFileError": {
      "category": "filesystem",
      "description": 'The error of the "MoveFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_MoveFileError",
      "params": []
    },
    "MoveFileResult": {
      "category": "filesystem",
      "description": 'The result of the "MoveFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_MoveFileResult",
      "params": []
    },
    "OpenBrowserError": {
      "category": "filesystem",
      "description": 'The error of the "OpenBrowser last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_OpenBrowserError",
      "params": []
    },
    "OpenBrowserResult": {
      "category": "filesystem",
      "description": 'The result of the "OpenBrowser last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_OpenBrowserResult",
      "params": []
    },
    "ReadBinaryFileError": {
      "category": "filesystem",
      "description": 'The error of the "ReadBinaryFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ReadBinaryFileError",
      "params": []
    },
    "ReadBinaryFileResult": {
      "category": "filesystem",
      "description": 'The result of the "ReadBinaryFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ReadBinaryFileResult",
      "params": []
    },
    "RenameFileError": {
      "category": "filesystem",
      "description": 'The error of the "RenameFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_RenameFileError",
      "params": []
    },
    "RenameFileResult": {
      "category": "filesystem",
      "description": 'The result of the "RenameFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_RenameFileResult",
      "params": []
    },
    "RunFileError": {
      "category": "filesystem",
      "description": 'The error of the "RunFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_RunFileError",
      "params": []
    },
    "RunFileResult": {
      "category": "filesystem",
      "description": 'The result of the "RunFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_RunFileResult",
      "params": []
    },
    "ShellOpenError": {
      "category": "filesystem",
      "description": 'The error of the "ShellOpen last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShellOpenError",
      "params": []
    },
    "ShellOpenResult": {
      "category": "filesystem",
      "description": 'The result of the "ShellOpen last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShellOpenResult",
      "params": []
    },
    "ExplorerOpenError": {
      "category": "filesystem",
      "description": 'The error of the "ExplorerOpen last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ExplorerOpenError",
      "params": []
    },
    "ExplorerOpenResult": {
      "category": "filesystem",
      "description": 'The result of the "ExplorerOpen last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ExplorerOpenResult",
      "params": []
    },
    "WriteBinaryFileError": {
      "category": "filesystem",
      "description": 'The error of the "WriteBinaryFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_WriteBinaryFileError",
      "params": []
    },
    "WriteBinaryFileResult": {
      "category": "filesystem",
      "description": 'The result of the "WriteBinaryFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_WriteBinaryFileResult",
      "params": []
    },
    "WriteTextFileError": {
      "category": "filesystem",
      "description": 'The error of the "WriteTextFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_WriteTextFileError",
      "params": []
    },
    "WriteTextFileResult": {
      "category": "filesystem",
      "description": 'The result of the "WriteTextFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_WriteTextFileResult",
      "params": []
    },
    "WriteTextError": {
      "category": "filesystem",
      "description": 'The error of the "WriteText last call"',
      "returnType": "string",
      "deprecated": true,
      "isDeprecated": true,
      "highlight": false,
      "forward": "_WriteTextError",
      "params": []
    },
    "WriteTextResult": {
      "category": "filesystem",
      "description": 'The result of the "WriteText last call"',
      "returnType": "string",
      "deprecated": true,
      "isDeprecated": true,
      "highlight": false,
      "forward": "_WriteTextResult",
      "params": []
    },
    "ReadTextFileError": {
      "category": "filesystem",
      "description": 'The error of the "ReadTextFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ReadTextFileError",
      "params": []
    },
    "ReadTextFileResult": {
      "category": "filesystem",
      "description": 'The result of the "ReadTextFile last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ReadTextFileResult",
      "params": []
    },
    "CheckIfPathExistError": {
      "category": "filesystem",
      "description": 'The error of the "CheckIfPathExist last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CheckIfPathExistError",
      "params": []
    },
    "CheckIfPathExistResult": {
      "category": "filesystem",
      "description": 'The result of the "CheckIfPathExist last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CheckIfPathExistResult",
      "params": []
    },
    "ShowFolderDialogError": {
      "category": "file-dialogs",
      "description": 'The error of the "ShowFolderDialog last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowFolderDialogError",
      "params": []
    },
    "ShowFolderDialogResult": {
      "category": "file-dialogs",
      "description": 'The result of the "ShowFolderDialog last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowFolderDialogResult",
      "params": []
    },
    "ShowOpenDialogError": {
      "category": "file-dialogs",
      "description": 'The error of the "ShowOpenDialog last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowOpenDialogError",
      "params": []
    },
    "ShowOpenDialogResult": {
      "category": "file-dialogs",
      "description": 'The result of the "ShowOpenDialog last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowOpenDialogResult",
      "params": []
    },
    "ShowSaveDialogError": {
      "category": "file-dialogs",
      "description": 'The error of the "ShowSaveDialog last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowSaveDialogError",
      "params": []
    },
    "ShowSaveDialogResult": {
      "category": "file-dialogs",
      "description": 'The result of the "ShowSaveDialog last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowSaveDialogResult",
      "params": []
    },
    "MaximizeError": {
      "category": "window",
      "description": 'The error of the "Maximize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_MaximizeError",
      "params": []
    },
    "MaximizeResult": {
      "category": "window",
      "description": 'The result of the "Maximize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_MaximizeResult",
      "params": []
    },
    "MinimizeError": {
      "category": "window",
      "description": 'The error of the "Minimize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_MinimizeError",
      "params": []
    },
    "MinimizeResult": {
      "category": "window",
      "description": 'The result of the "Minimize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_MinimizeResult",
      "params": []
    },
    "RestoreError": {
      "category": "window",
      "description": 'The error of the "Restore last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_RestoreError",
      "params": []
    },
    "RestoreResult": {
      "category": "window",
      "description": 'The result of the "Restore last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_RestoreResult",
      "params": []
    },
    "RequestAttentionError": {
      "category": "window",
      "description": 'The error of the "RequestAttention last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_RequestAttentionError",
      "params": []
    },
    "RequestAttentionResult": {
      "category": "window",
      "description": 'The result of the "RequestAttention last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_RequestAttentionResult",
      "params": []
    },
    "SetAlwaysOnTopError": {
      "category": "window",
      "description": 'The error of the "SetAlwaysOnTop last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetAlwaysOnTopError",
      "params": []
    },
    "SetAlwaysOnTopResult": {
      "category": "window",
      "description": 'The result of the "SetAlwaysOnTop last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetAlwaysOnTopResult",
      "params": []
    },
    "SetHeightError": {
      "category": "window",
      "description": 'The error of the "SetHeight last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetHeightError",
      "params": []
    },
    "SetHeightResult": {
      "category": "window",
      "description": 'The result of the "SetHeight last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetHeightResult",
      "params": []
    },
    "SetMaximumSizeError": {
      "category": "window",
      "description": 'The error of the "SetMaximumSize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetMaximumSizeError",
      "params": []
    },
    "SetMaximumSizeResult": {
      "category": "window",
      "description": 'The result of the "SetMaximumSize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetMaximumSizeResult",
      "params": []
    },
    "SetMinimumSizeError": {
      "category": "window",
      "description": 'The error of the "SetMinimumSize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetMinimumSizeError",
      "params": []
    },
    "SetMinimumSizeResult": {
      "category": "window",
      "description": 'The result of the "SetMinimumSize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetMinimumSizeResult",
      "params": []
    },
    "SetResizableError": {
      "category": "window",
      "description": 'The error of the "SetResizable last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetResizableError",
      "params": []
    },
    "SetResizableResult": {
      "category": "window",
      "description": 'The result of the "SetResizable last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetResizableResult",
      "params": []
    },
    "SetTitleError": {
      "category": "window",
      "description": 'The error of the "SetTitle last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetTitleError",
      "params": []
    },
    "SetTitleResult": {
      "category": "window",
      "description": 'The result of the "SetTitle last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetTitleResult",
      "params": []
    },
    "SetWidthError": {
      "category": "window",
      "description": 'The error of the "SetWidth last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetWidthError",
      "params": []
    },
    "SetWidthResult": {
      "category": "window",
      "description": 'The result of the "SetWidth last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetWidthResult",
      "params": []
    },
    "SetXError": {
      "category": "window",
      "description": 'The error of the "SetX last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetXError",
      "params": []
    },
    "SetXResult": {
      "category": "window",
      "description": 'The result of the "SetX last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetXResult",
      "params": []
    },
    "SetYError": {
      "category": "window",
      "description": 'The error of the "SetY last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetYError",
      "params": []
    },
    "SetYResult": {
      "category": "window",
      "description": 'The result of the "SetY last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetYResult",
      "params": []
    },
    "ShowDevToolsError": {
      "category": "window",
      "description": 'The error of the "ShowDevTools last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowDevToolsError",
      "params": []
    },
    "ShowDevToolsResult": {
      "category": "window",
      "description": 'The result of the "ShowDevTools last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowDevToolsResult",
      "params": []
    },
    "UnmaximizeError": {
      "category": "window",
      "description": 'The error of the "Unmaximize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_UnmaximizeError",
      "params": []
    },
    "UnmaximizeResult": {
      "category": "window",
      "description": 'The result of the "Unmaximize last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_UnmaximizeResult",
      "params": []
    },
    "SetFullscreenError": {
      "category": "window",
      "description": 'The error of the "SetFullscreen last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetFullscreenError",
      "params": []
    },
    "SetFullscreenResult": {
      "category": "window",
      "description": 'The result of the "SetFullscreen last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetFullscreenResult",
      "params": []
    },
    "ActivateAchievementError": {
      "category": "steam",
      "description": 'The error of the "ActivateAchievement last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ActivateAchievementError",
      "params": []
    },
    "ActivateAchievementResult": {
      "category": "steam",
      "description": 'The result of the "ActivateAchievement last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ActivateAchievementResult",
      "params": []
    },
    "ClearAchievementError": {
      "category": "steam",
      "description": 'The error of the "ClearAchievement last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ClearAchievementError",
      "params": []
    },
    "ClearAchievementResult": {
      "category": "steam",
      "description": 'The result of the "ClearAchievement last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ClearAchievementResult",
      "params": []
    },
    "CheckAchievementActivationStateError": {
      "category": "steam",
      "description": 'The error of the "CheckAchievementActivationState last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CheckAchievementActivationStateError",
      "params": []
    },
    "CheckAchievementActivationStateResult": {
      "category": "steam",
      "description": 'The result of the "CheckAchievementActivationState last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CheckAchievementActivationStateResult",
      "params": []
    },
    "SetRichPresenceError": {
      "category": "steam",
      "description": 'The error of the "SetRichPresence last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetRichPresenceError",
      "params": []
    },
    "SetRichPresenceResult": {
      "category": "steam",
      "description": 'The result of the "SetRichPresence last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SetRichPresenceResult",
      "params": []
    },
    "DiscordSetActivityError": {
      "category": "discord",
      "description": 'The error of the "DiscordSetActivity last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_DiscordSetActivityError",
      "params": []
    },
    "DiscordSetActivityResult": {
      "category": "discord",
      "description": 'The result of the "DiscordSetActivity last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_DiscordSetActivityResult",
      "params": []
    },
    "LeaderboardUploadScoreError": {
      "category": "steam",
      "description": 'The error of the "LeaderboardUploadScore last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_LeaderboardUploadScoreError",
      "params": []
    },
    "LeaderboardUploadScoreResult": {
      "category": "steam",
      "description": 'The result of the "LeaderboardUploadScore last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_LeaderboardUploadScoreResult",
      "params": []
    },
    "LeaderboardUploadScoreWithMetadataError": {
      "category": "steam",
      "description": 'The error of the "LeaderboardUploadScoreWithMetadata last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_LeaderboardUploadScoreWithMetadataError",
      "params": []
    },
    "LeaderboardUploadScoreWithMetadataResult": {
      "category": "steam",
      "description": 'The result of the "LeaderboardUploadScoreWithMetadata last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_LeaderboardUploadScoreWithMetadataResult",
      "params": []
    },
    "LeaderboardDownloadScoreError": {
      "category": "steam",
      "description": 'The error of the "LeaderboardDownloadScore last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_LeaderboardDownloadScoreError",
      "params": []
    },
    "LeaderboardDownloadScoreResult": {
      "category": "steam",
      "description": 'The result of the "LeaderboardDownloadScore last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_LeaderboardDownloadScoreResult",
      "params": []
    },
    "ActivateToWebPageError": {
      "category": "steam",
      "description": 'The error of the "ActivateToWebPage last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ActivateToWebPageError",
      "params": []
    },
    "ActivateToWebPageResult": {
      "category": "steam",
      "description": 'The result of the "ActivateToWebPage last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ActivateToWebPageResult",
      "params": []
    },
    "ActivateToStoreError": {
      "category": "steam",
      "description": 'The error of the "ActivateToStore last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ActivateToStoreError",
      "params": []
    },
    "ActivateToStoreResult": {
      "category": "steam",
      "description": 'The result of the "ActivateToStore last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ActivateToStoreResult",
      "params": []
    },
    "GetSteamUILanguageError": {
      "category": "steam",
      "description": 'The error of the "GetSteamUILanguage last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetSteamUILanguageError",
      "params": []
    },
    "GetSteamUILanguageResult": {
      "category": "steam",
      "description": 'The result of the "GetSteamUILanguage last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetSteamUILanguageResult",
      "params": []
    },
    "GetAvailableGameLanguagesError": {
      "category": "steam",
      "description": 'The error of the "GetAvailableGameLanguages last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetAvailableGameLanguagesError",
      "params": []
    },
    "GetAvailableGameLanguagesResult": {
      "category": "steam",
      "description": 'The result of the "GetAvailableGameLanguages last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetAvailableGameLanguagesResult",
      "params": []
    },
    "GetCurrentGameLanguageError": {
      "category": "steam",
      "description": 'The error of the "GetCurrentGameLanguage last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetCurrentGameLanguageError",
      "params": []
    },
    "GetCurrentGameLanguageResult": {
      "category": "steam",
      "description": 'The result of the "GetCurrentGameLanguage last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetCurrentGameLanguageResult",
      "params": []
    },
    "TriggerScreenshotError": {
      "category": "steam",
      "description": 'The error of the "TriggerScreenshot last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_TriggerScreenshotError",
      "params": []
    },
    "TriggerScreenshotResult": {
      "category": "steam",
      "description": 'The result of the "TriggerScreenshot last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_TriggerScreenshotResult",
      "params": []
    },
    "SaveScreenshotFromURLError": {
      "category": "steam",
      "description": 'The error of the "SaveScreenshotFromURL last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SaveScreenshotFromURLError",
      "params": []
    },
    "SaveScreenshotFromURLResult": {
      "category": "steam",
      "description": 'The result of the "SaveScreenshotFromURL last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SaveScreenshotFromURLResult",
      "params": []
    },
    "AddScreenshotToLibraryError": {
      "category": "steam",
      "description": 'The error of the "AddScreenshotToLibrary last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_AddScreenshotToLibraryError",
      "params": []
    },
    "AddScreenshotToLibraryResult": {
      "category": "steam",
      "description": 'The result of the "AddScreenshotToLibrary last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_AddScreenshotToLibraryResult",
      "params": []
    },
    "CheckDLCIsInstalledError": {
      "category": "steam",
      "description": 'The error of the "CheckDLCIsInstalled last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CheckDLCIsInstalledError",
      "params": []
    },
    "CheckDLCIsInstalledResult": {
      "category": "steam",
      "description": 'The result of the "CheckDLCIsInstalled last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CheckDLCIsInstalledResult",
      "params": []
    },
    "ShowGamepadTextInputError": {
      "category": "steam",
      "description": 'The error of the "ShowGamepadTextInput last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowGamepadTextInputError",
      "params": []
    },
    "ShowGamepadTextInputResult": {
      "category": "steam",
      "description": 'The result of the "ShowGamepadTextInput last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowGamepadTextInputResult",
      "params": []
    },
    "ShowFloatingGamepadTextInputError": {
      "category": "steam",
      "description": 'The error of the "ShowFloatingGamepadTextInput last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowFloatingGamepadTextInputError",
      "params": []
    },
    "ShowFloatingGamepadTextInputResult": {
      "category": "steam",
      "description": 'The result of the "ShowFloatingGamepadTextInput last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_ShowFloatingGamepadTextInputResult",
      "params": []
    },
    "CreateWorkshopItemError": {
      "category": "steam-workshop",
      "description": 'The error of the "CreateWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CreateWorkshopItemError",
      "params": []
    },
    "CreateWorkshopItemResult": {
      "category": "steam-workshop",
      "description": 'The result of the "CreateWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_CreateWorkshopItemResult",
      "params": []
    },
    "UpdateWorkshopItemError": {
      "category": "steam-workshop",
      "description": 'The error of the "UpdateWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_UpdateWorkshopItemError",
      "params": []
    },
    "UpdateWorkshopItemResult": {
      "category": "steam-workshop",
      "description": 'The result of the "UpdateWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_UpdateWorkshopItemResult",
      "params": []
    },
    "GetSubscribedItemsWithMetadataError": {
      "category": "steam-workshop",
      "description": 'The error of the "GetSubscribedItemsWithMetadata last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetSubscribedItemsWithMetadataError",
      "params": []
    },
    "GetSubscribedItemsWithMetadataResult": {
      "category": "steam-workshop",
      "description": 'The result of the "GetSubscribedItemsWithMetadata last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetSubscribedItemsWithMetadataResult",
      "params": []
    },
    "DownloadWorkshopItemError": {
      "category": "steam-workshop",
      "description": 'The error of the "DownloadWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_DownloadWorkshopItemError",
      "params": []
    },
    "DownloadWorkshopItemResult": {
      "category": "steam-workshop",
      "description": 'The result of the "DownloadWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_DownloadWorkshopItemResult",
      "params": []
    },
    "DeleteWorkshopItemError": {
      "category": "steam-workshop",
      "description": 'The error of the "DeleteWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_DeleteWorkshopItemError",
      "params": []
    },
    "DeleteWorkshopItemResult": {
      "category": "steam-workshop",
      "description": 'The result of the "DeleteWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_DeleteWorkshopItemResult",
      "params": []
    },
    "SubscribeWorkshopItemError": {
      "category": "steam-workshop",
      "description": 'The error of the "SubscribeWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SubscribeWorkshopItemError",
      "params": []
    },
    "SubscribeWorkshopItemResult": {
      "category": "steam-workshop",
      "description": 'The result of the "SubscribeWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_SubscribeWorkshopItemResult",
      "params": []
    },
    "UnsubscribeWorkshopItemError": {
      "category": "steam-workshop",
      "description": 'The error of the "UnsubscribeWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_UnsubscribeWorkshopItemError",
      "params": []
    },
    "UnsubscribeWorkshopItemResult": {
      "category": "steam-workshop",
      "description": 'The result of the "UnsubscribeWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_UnsubscribeWorkshopItemResult",
      "params": []
    },
    "GetWorkshopItemStateError": {
      "category": "steam-workshop",
      "description": 'The error of the "GetWorkshopItemState last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemStateError",
      "params": []
    },
    "GetWorkshopItemStateResult": {
      "category": "steam-workshop",
      "description": 'The result of the "GetWorkshopItemState last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemStateResult",
      "params": []
    },
    "GetWorkshopItemInstallInfoError": {
      "category": "steam-workshop",
      "description": 'The error of the "GetWorkshopItemInstallInfo last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemInstallInfoError",
      "params": []
    },
    "GetWorkshopItemInstallInfoResult": {
      "category": "steam-workshop",
      "description": 'The result of the "GetWorkshopItemInstallInfo last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemInstallInfoResult",
      "params": []
    },
    "GetWorkshopItemDownloadInfoError": {
      "category": "steam-workshop",
      "description": 'The error of the "GetWorkshopItemDownloadInfo last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemDownloadInfoError",
      "params": []
    },
    "GetWorkshopItemDownloadInfoResult": {
      "category": "steam-workshop",
      "description": 'The result of the "GetWorkshopItemDownloadInfo last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemDownloadInfoResult",
      "params": []
    },
    "GetWorkshopItemError": {
      "category": "steam-workshop",
      "description": 'The error of the "GetWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemError",
      "params": []
    },
    "GetWorkshopItemResult": {
      "category": "steam-workshop",
      "description": 'The result of the "GetWorkshopItem last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemResult",
      "params": []
    },
    "GetWorkshopItemsError": {
      "category": "steam-workshop",
      "description": 'The error of the "GetWorkshopItems last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemsError",
      "params": []
    },
    "GetWorkshopItemsResult": {
      "category": "steam-workshop",
      "description": 'The result of the "GetWorkshopItems last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemsResult",
      "params": []
    },
    "GetSubscribedWorkshopItemsError": {
      "category": "steam-workshop",
      "description": 'The error of the "GetSubscribedWorkshopItems last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetSubscribedWorkshopItemsError",
      "params": []
    },
    "GetSubscribedWorkshopItemsResult": {
      "category": "steam-workshop",
      "description": 'The result of the "GetSubscribedWorkshopItems last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetSubscribedWorkshopItemsResult",
      "params": []
    },
    "GetWorkshopItemWithMetadataError": {
      "category": "steam-workshop",
      "description": 'The error of the "GetWorkshopItemWithMetadata last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemWithMetadataError",
      "params": []
    },
    "GetWorkshopItemWithMetadataResult": {
      "category": "steam-workshop",
      "description": 'The result of the "GetWorkshopItemWithMetadata last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemWithMetadataResult",
      "params": []
    },
    "GetWorkshopItemsWithMetadataError": {
      "category": "steam-workshop",
      "description": 'The error of the "GetWorkshopItemsWithMetadata last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemsWithMetadataError",
      "params": []
    },
    "GetWorkshopItemsWithMetadataResult": {
      "category": "steam-workshop",
      "description": 'The result of the "GetWorkshopItemsWithMetadata last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetWorkshopItemsWithMetadataResult",
      "params": []
    },
    "SubscribedItemsCount": {
      "category": "steam-workshop",
      "forward": "_SubscribedItemsCount",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Get the number of subscribed workshop items",
      "params": []
    },
    "SubscribedItemIdAt": {
      "category": "steam-workshop",
      "forward": "_SubscribedItemIdAt",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "params": [
        {
          "id": "index",
          "desc": "The index of the item (0 to count-1)",
          "name": "Index",
          "type": "number"
        }
      ],
      "description": "Get the workshop item ID at the given index"
    },
    "WorkshopItemTitle": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemTitle",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the title of a workshop item"
    },
    "WorkshopItemDescription": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemDescription",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the description of a workshop item"
    },
    "WorkshopItemOwnerSteamId64": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemOwnerSteamId64",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the owner's Steam ID64 of a workshop item"
    },
    "WorkshopItemOwnerAccountId": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemOwnerAccountId",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the owner's account ID of a workshop item"
    },
    "WorkshopItemTags": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemTags",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the tags of a workshop item (comma-separated)"
    },
    "WorkshopItemUpvotes": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemUpvotes",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the number of upvotes for a workshop item"
    },
    "WorkshopItemDownvotes": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemDownvotes",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the number of downvotes for a workshop item"
    },
    "WorkshopItemPreviewUrl": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemPreviewUrl",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the preview image URL of a workshop item"
    },
    "WorkshopItemUrl": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemUrl",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the Steam Workshop URL of a workshop item"
    },
    "WorkshopItemTimeCreated": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemTimeCreated",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the creation timestamp of a workshop item (Unix epoch)"
    },
    "WorkshopItemTimeUpdated": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemTimeUpdated",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the last update timestamp of a workshop item (Unix epoch)"
    },
    "WorkshopItemState": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemState",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the state bitfield of a workshop item"
    },
    "WorkshopItemIsInstalled": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemIsInstalled",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Check if a workshop item is installed (returns 0 or 1)"
    },
    "WorkshopItemIsDownloading": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemIsDownloading",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Check if a workshop item is downloading (returns 0 or 1)"
    },
    "WorkshopItemNeedsUpdate": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemNeedsUpdate",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Check if a workshop item needs an update (returns 0 or 1)"
    },
    "WorkshopItemInstallFolder": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemInstallFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the installation folder path of a workshop item"
    },
    "WorkshopItemSizeOnDisk": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemSizeOnDisk",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the size on disk of a workshop item in bytes"
    },
    "WorkshopItemTimestamp": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemTimestamp",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the install timestamp of a workshop item"
    },
    "WorkshopItemDownloadCurrent": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemDownloadCurrent",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the current download progress of a workshop item"
    },
    "WorkshopItemDownloadTotal": {
      "category": "steam-workshop",
      "forward": "_WorkshopItemDownloadTotal",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "itemId",
          "desc": "The workshop item ID",
          "name": "Item ID",
          "type": "string"
        }
      ],
      "description": "Get the total download progress of a workshop item"
    },
    "GetFriendsError": {
      "category": "steam",
      "description": 'The error of the "GetFriends last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetFriendsError",
      "params": []
    },
    "GetFriendsResult": {
      "category": "steam",
      "description": 'The result of the "GetFriends last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetFriendsResult",
      "params": []
    },
    "GetFriendNameError": {
      "category": "steam",
      "description": 'The error of the "GetFriendName last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetFriendNameError",
      "params": []
    },
    "GetFriendNameResult": {
      "category": "steam",
      "description": 'The result of the "GetFriendName last call"',
      "returnType": "string",
      "deprecated": false,
      "isDeprecated": false,
      "highlight": false,
      "forward": "_GetFriendNameResult",
      "params": []
    },
    "ArgumentAt": {
      "category": "command-line",
      "forward": "_ArgumentAt",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "params": [
        {
          "id": "index",
          "desc": "The index of the argument to get.",
          "name": "Index",
          "type": "number"
        }
      ],
      "description": "Get the argument at the given index."
    },
    "ArgumentCount": {
      "category": "command-line",
      "forward": "_ArgumentCount",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Get the number of arguments.",
      "params": []
    },
    "AppFolderURL": {
      "category": "filesystem",
      "forward": "_AppFolderURL",
      "highlight": false,
      "deprecated": true,
      "returnType": "string",
      "description": "Return the URL of the folder of the current app.",
      "params": []
    },
    "DroppedFile": {
      "category": "filesystem",
      "forward": "_DroppedFile",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Return the dropped file after a file drop.",
      "params": []
    },
    "ListAt": {
      "category": "filesystem",
      "forward": "_ListAt",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "params": [
        {
          "id": "index",
          "desc": "The index of the file to get.",
          "name": "Index",
          "type": "number"
        }
      ],
      "description": "Get the file at the given index."
    },
    "ListCount": {
      "category": "filesystem",
      "forward": "_ListCount",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Get the number of files in the folder.",
      "params": []
    },
    "ProjectFilesFolder": {
      "category": "filesystem",
      "forward": "_ProjectFilesFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Return the folder of the project files.",
      "params": []
    },
    "ProjectFilesFolderURL": {
      "category": "filesystem",
      "forward": "_ProjectFilesFolderURL",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Return the URL of the folder of the project files.",
      "params": []
    },
    "ReadFile": {
      "category": "filesystem",
      "forward": "_ReadFile",
      "highlight": false,
      "deprecated": true,
      "returnType": "string",
      "description": "Return the contents of the file.",
      "params": []
    },
    "UserFolder": {
      "category": "filesystem",
      "forward": "_UserFolder",
      "highlight": false,
      "deprecated": true,
      "isDeprecated": true,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current User's folder",
      "params": []
    },
    "HomeFolder": {
      "category": "filesystem",
      "forward": "_HomeFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current Home folder",
      "params": []
    },
    "AppDataFolder": {
      "category": "filesystem",
      "forward": "_AppDataFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current AppDataFolder folder",
      "params": []
    },
    "LocalAppDataFolder": {
      "category": "filesystem",
      "forward": "_LocalAppDataFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current AppDataFolder folder",
      "params": []
    },
    "UserDataFolder": {
      "category": "filesystem",
      "forward": "_UserDataFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current UserDataFolder folder",
      "params": []
    },
    "LocalUserDataFolder": {
      "category": "filesystem",
      "forward": "_LocalUserDataFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current LocalUserDataFolder folder",
      "params": []
    },
    "SessionDataFolder": {
      "category": "filesystem",
      "forward": "_SessionDataFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current SessionDataFolder folder",
      "params": []
    },
    "TempFolder": {
      "category": "filesystem",
      "forward": "_TempFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current TempFolder folder",
      "params": []
    },
    "ExeFolder": {
      "category": "filesystem",
      "forward": "_ExeFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current ExeFolder folder",
      "params": []
    },
    "ModuleFolder": {
      "category": "filesystem",
      "forward": "_ModuleFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current ModuleFolder folder",
      "params": []
    },
    "DesktopFolder": {
      "category": "filesystem",
      "forward": "_DesktopFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current DesktopFolder folder",
      "params": []
    },
    "DocumentsFolder": {
      "category": "filesystem",
      "forward": "_DocumentsFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current DocumentsFolder folder",
      "params": []
    },
    "DownloadsFolder": {
      "category": "filesystem",
      "forward": "_DownloadsFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current DownloadsFolder folder",
      "params": []
    },
    "MusicFolder": {
      "category": "filesystem",
      "forward": "_MusicFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current MusicFolder folder",
      "params": []
    },
    "PicturesFolder": {
      "category": "filesystem",
      "forward": "_PicturesFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current PicturesFolder folder",
      "params": []
    },
    "VideosFolder": {
      "category": "filesystem",
      "forward": "_VideosFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current VideosFolder folder",
      "params": []
    },
    "RecentFolder": {
      "category": "filesystem",
      "forward": "_RecentFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current RecentFolder folder",
      "params": []
    },
    "LogsFolder": {
      "category": "filesystem",
      "forward": "_LogsFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current LogsFolder folder",
      "params": []
    },
    "CrashDumpsFolder": {
      "category": "filesystem",
      "forward": "_CrashDumpsFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "isVariadicParameters": false,
      "description": "Return the current CrashDumpsFolder folder",
      "params": []
    },
    "AppFolder": {
      "category": "filesystem",
      "forward": "_AppFolder",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Return the folder of the current app.",
      "params": []
    },
    "WindowHeight": {
      "category": "window",
      "forward": "_WindowHeight",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Return the height of the window.",
      "params": []
    },
    "WindowWidth": {
      "category": "window",
      "forward": "_WindowWidth",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Return the width of the window.",
      "params": []
    },
    "WindowTitle": {
      "category": "window",
      "forward": "_WindowTitle",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Return the title of the window.",
      "params": []
    },
    "WindowX": {
      "category": "window",
      "forward": "_WindowX",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Return the x position of the window.",
      "params": []
    },
    "WindowY": {
      "category": "window",
      "forward": "_WindowY",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Return the y position of the window.",
      "params": []
    },
    "FullscreenState": {
      "category": "window",
      "forward": "_FullscreenState",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Return the fullscreen state of the window.",
      "params": []
    },
    "CurrentPlatform": {
      "category": "general",
      "forward": "_CurrentPlatform",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Get the current platform (e.g., 'win32', 'darwin', 'linux').",
      "params": []
    },
    "CurrentArchitecture": {
      "category": "general",
      "forward": "_CurrentArchitecture",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Get the current architecture (e.g., 'x64', 'arm64').",
      "params": []
    },
    "SteamAccountId": {
      "category": "steam",
      "forward": "_SteamAccountId",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Get the Steam account ID.",
      "params": []
    },
    "SteamId32": {
      "category": "steam",
      "forward": "_SteamId32",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Get the Steam ID32.",
      "params": []
    },
    "SteamId64": {
      "category": "steam",
      "forward": "_SteamId64",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Get the Steam ID64.",
      "params": []
    },
    "SteamUsername": {
      "category": "steam",
      "forward": "_SteamUsername",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Get the Steam username.",
      "params": []
    },
    "SteamLevel": {
      "category": "steam",
      "forward": "_SteamLevel",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Get the Steam level.",
      "params": []
    },
    "SteamIpCountry": {
      "category": "steam",
      "forward": "_SteamIpCountry",
      "highlight": false,
      "deprecated": false,
      "returnType": "string",
      "description": "Get the Steam IP country.",
      "params": []
    },
    "SteamIsRunningOnSteamDeck": {
      "category": "steam",
      "forward": "_SteamIsRunningOnSteamDeck",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Return true if the app is running on a Steam Deck.",
      "params": []
    },
    "SteamAppId": {
      "category": "steam",
      "forward": "_SteamAppId",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "description": "Get the currently used Steam App ID.",
      "params": []
    },
    "SteamIsOffline": {
      "category": "steam",
      "forward": "_SteamIsOffline",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "state",
          "desc": "The steam persona state to check.",
          "name": "State",
          "type": "number"
        }
      ],
      "description": "Return 1 if the provided steam state is Offline (0)."
    },
    "SteamIsOnline": {
      "category": "steam",
      "forward": "_SteamIsOnline",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "state",
          "desc": "The steam persona state to check.",
          "name": "State",
          "type": "number"
        }
      ],
      "description": "Return 1 if the provided steam state is Online (1)."
    },
    "SteamIsBusy": {
      "category": "steam",
      "forward": "_SteamIsBusy",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "state",
          "desc": "The steam persona state to check.",
          "name": "State",
          "type": "number"
        }
      ],
      "description": "Return 1 if the provided steam state is Busy (2)."
    },
    "SteamIsAway": {
      "category": "steam",
      "forward": "_SteamIsAway",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "state",
          "desc": "The steam persona state to check.",
          "name": "State",
          "type": "number"
        }
      ],
      "description": "Return 1 if the provided steam state is Away (3)."
    },
    "SteamIsSnooze": {
      "category": "steam",
      "forward": "_SteamIsSnooze",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "state",
          "desc": "The steam persona state to check.",
          "name": "State",
          "type": "number"
        }
      ],
      "description": "Return 1 if the provided steam state is Snooze (4)."
    },
    "SteamIsLookingToTrade": {
      "category": "steam",
      "forward": "_SteamIsLookingToTrade",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "state",
          "desc": "The steam persona state to check.",
          "name": "State",
          "type": "number"
        }
      ],
      "description": "Return 1 if the provided steam state is Looking to Trade (5)."
    },
    "SteamIsLookingToPlay": {
      "category": "steam",
      "forward": "_SteamIsLookingToPlay",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "state",
          "desc": "The steam persona state to check.",
          "name": "State",
          "type": "number"
        }
      ],
      "description": "Return 1 if the provided steam state is Looking to Play (6)."
    },
    "SteamIsInvisible": {
      "category": "steam",
      "forward": "_SteamIsInvisible",
      "highlight": false,
      "deprecated": false,
      "returnType": "number",
      "params": [
        {
          "id": "state",
          "desc": "The steam persona state to check.",
          "name": "State",
          "type": "number"
        }
      ],
      "description": "Return 1 if the provided steam state is Invisible (7)."
    }
  }
};
function getInstanceJs(parentClass2, addonTriggers2, C32) {
  return class Pipelab extends parentClass2 {
    /**
     * @type {any}
     */
    _additionalLoadPromises = [];
    /** @type {SDK.IObjectInstance | undefined} */
    _inst;
    /**
     * @type {PipelabInfos | undefined}
     */
    pipelabInfos;
    /** @type {WebSocketClient | undefined} */
    WebSocketClient;
    /** @type {string} */
    _userFolder = "";
    /** @type {string} */
    _homeFolder = "";
    /** @type {string} */
    _appDataFolder = "";
    /** @type {string} */
    _userDataFolder = "";
    /** @type {string} */
    _localAppDataFolder = "";
    /** @type {string} */
    _localUserDataFolder = "";
    /** @type {string} */
    _sessionDataFolder = "";
    /** @type {string} */
    _tempFolder = "";
    /** @type {string} */
    _exeFolder = "";
    /** @type {string} */
    _moduleFolder = "";
    /** @type {string} */
    _desktopFolder = "";
    /** @type {string} */
    _documentsFolder = "";
    /** @type {string} */
    _downloadsFolder = "";
    /** @type {string} */
    _musicFolder = "";
    /** @type {string} */
    _picturesFolder = "";
    /** @type {string} */
    _videosFolder = "";
    /** @type {string} */
    _recentFolder = "";
    /** @type {string} */
    _logsFolder = "";
    /** @type {string} */
    _crashDumpsFolder = "";
    /** @type {string} */
    _appFolder = "";
    /** @type {string} */
    _projectFilesFolder = "";
    /** @type {string} - The current tag of the trigger. Can be used for any trigger */
    _currentTag = "";
    /** @type {import('@pipelab/core').MessageEngine['output']['body']['engine']} */
    _engine = "electron";
    /** @type {boolean} */
    _isInitialized = false;
    /** @type {boolean} */
    _lastPathExists = false;
    /** @type {number} */
    _windowHeight = -1;
    /** @type {number} */
    _windowWidth = -1;
    /** @type {string} */
    _windowTitle = "";
    /** @type {number} */
    _windowX = -1;
    /** @type {number} */
    _windowY = -1;
    /** @type {import("./sdk.js").IsFullScreenState} */
    _fullscreenState = 0;
    _lastOverlayState = false;
    /** @type {{accountId: number, steamId32: string, steamId64: string}} */
    _steam_SteamId = defaultSteamId;
    /** @type {import('@pipelab/core').NamespacedFunctionReturnType<'localplayer', 'getName'>} */
    _steam_Name = "";
    /** @type {import('@pipelab/core').NamespacedFunctionReturnType<'localplayer', 'getLevel'>} */
    _steam_Level = -1;
    /** @type {import('@pipelab/core').NamespacedFunctionReturnType<'localplayer', 'getIpCountry'>} */
    _steam_IpCountry = "";
    /** @type {import('@pipelab/core').NamespacedFunctionReturnType<'utils', 'isSteamRunningOnSteamDeck'>} */
    _steam_IsRunningOnSteamDeck = false;
    /** @type {string} */
    _platform = "";
    /** @type {string} */
    _arch = "";
    /** @type {number} */
    _steam_AppId = -1;
    /** @type {string} */
    _ListFilesErrorValue = "";
    /** @type {import("@pipelab/core").FileFolder[]} */
    _ListFilesResultValue = [];
    /** @type {string} */
    _ActivateToWebPageErrorValue = "";
    /** @type {boolean} */
    _ActivateToWebPageResultValue = false;
    /** @type {string} */
    _ActivateToStoreErrorValue = "";
    /** @type {boolean} */
    _ActivateToStoreResultValue = false;
    /** @type {string} */
    _GetSteamUILanguageErrorValue = "";
    /** @type {string} */
    _GetSteamUILanguageResultValue = "";
    /** @type {string} */
    _GetAvailableGameLanguagesErrorValue = "";
    /** @type {string} */
    _GetAvailableGameLanguagesResultValue = "";
    /** @type {string} */
    _GetCurrentGameLanguageErrorValue = "";
    /** @type {string} */
    _GetCurrentGameLanguageResultValue = "";
    /** @type {any[]} */
    _friendsList = [];
    /** @type {string} */
    _GetFriendsErrorValue = "";
    /** @type {string} */
    _GetFriendsResultValue = "";
    /** @type {string} */
    _GetFriendNameErrorValue = "";
    /** @type {string} */
    _GetFriendNameResultValue = "";
    /**
     * Description
     * @param {ISDKInstanceBase_} inst
     * @param {any} _properties
     */
    constructor(inst, _properties) {
      let dummyInst = void 0;
      if (sdk === "v1") {
        dummyInst = inst;
      } else {
        dummyInst = {
          domComponentId: DOM_COMPONENT_ID
        };
      }
      super(dummyInst);
      let properties;
      if (sdk == "v1") {
        properties = _properties;
      } else {
        properties = this._getInitProperties();
      }
      if (properties) {
      }
      if (sdk === "v1") {
        this._triggerAsync = this.TriggerAsync;
        this._trigger = (...args) => {
          return this.Trigger(...args);
        };
      }
      if (sdk === "v1") {
        this.c3runtime = this._runtime;
      } else {
        this.c3runtime = this.runtime;
      }
      if (sdk === "v1") {
        this.addLoadPromise = this.c3runtime.AddLoadPromise;
      } else {
        this.addLoadPromise = this.c3runtime.sdk.addLoadPromise;
      }
      if (sdk === "v1") {
        this.postToDOMAsync = this.PostToDOMAsync;
      } else {
        this.postToDOMAsync = this._postToDOMAsync;
      }
      if (sdk === "v1") {
        this.postToDOM = this.PostToDOM;
      } else {
        this.postToDOM = this._postToDOM;
      }
      if (sdk === "v1") {
        this.addDOMMessageHandler = this.AddDOMMessageHandler;
      } else {
        this.addDOMMessageHandler = this._addDOMMessageHandler;
      }
      this?.addLoadPromise?.(
        this.postToDOMAsync("get-fullscreen-state").then(
          /** @type {import("./sdk.js").PostFullscreenState} */
          (data) => {
            this._fullscreenState = data.state;
          }
        )
      );
      this.addDOMMessageHandler("fullscreen-state-changed", (data) => {
        this._fullscreenState = data.state;
      });
      this?.addLoadPromise?.(
        this.postToDOMAsync("get-infos").then(
          (data) => {
            this.pipelabInfos = data;
          }
        )
      );
    }
    async unsupportedEngine() {
      console.warn(`Unable to execute action:
- unsupported engine
- server not reachable
- plugin not initialized
`);
    }
    /**
     * @param {Tag} tag
     * @param {[import("./sdk.js").OpaqueCnds, import("./sdk.js").OpaqueCnds]} fns
     */
    async trigger(tag, fns) {
      if (tag) {
        this._currentTag = tag;
        this._trigger(fns[0]);
        this._trigger(fns[1]);
        this._currentTag = "";
      } else {
        await this._triggerAsync(fns[1]);
      }
    }
    /**
     * @template {(...args: any[]) => any} T
     * @param {T} base
     * @param {(...params: Parameters<T>) => unknown} callback
     * @param {(...params: Parameters<T>) => unknown} [fallback]
     * @param {boolean} [force]
     * @param {boolean} [isInitialize]
     * @returns {T}
     */
    wrap(base, callback, fallback, force, isInitialize) {
      return (...args) => {
        if (!this._isInitialized && !isInitialize) {
          console.warn("Plugin has no been initialized. Please use the according action at the start of layout");
        }
        if (this._isInitialized) {
          if (this.ws?.isConnected) {
            return callback.call(this, ...args);
          } else {
            return fallback ? fallback.call(this, ...args) : callback.call(this, ...args);
          }
        } else if (force) {
          return callback.call(this, ...args);
        } else {
          return fallback ? fallback.call(this, ...args) : callback.call(this, ...args);
        }
      };
    }
    /**
     * @template {(...args: any[]) => any} T
     * @param {T} base
     * @param {(...params: Parameters<T>) => unknown} callback
     * @returns {T}
     */
    exprs(base, callback) {
      return (...args) => {
        return callback.call(this, ...args);
      };
    }
    // Acts
    _Initialize = this.wrap(super._Initialize, async (tag) => {
      console.info("Pipelab v" + config.version);
      console.info("SDK " + sdk);
      try {
        if (!this.ws) {
          this.ws = new WebSocketClient("ws://localhost:31753", {
            maxReconnectAttempts: 3,
            reconnectInterval: 5e3
          });
        }
        globalThis.pipelab = {
          ws: this.ws
        };
        this.ws.on("/window/fullscreen-state", async (data) => {
          this._fullscreenState = fullscreenPipelabStateToC3State(data.body.state);
        });
        this.ws.on("/steam/overlay-activated", async (data) => {
          this._lastOverlayState = data.body.active;
          if (this._lastOverlayState) {
            await this._triggerAsync(C32.Plugins.pipelabv2.Cnds.OnOverlayActivated);
          } else {
            await this._triggerAsync(C32.Plugins.pipelabv2.Cnds.OnOverlayDeactivated);
          }
        });
        await this.ws.connect();
        const paths = [
          // app.getPath(name)
          ["home", "_homeFolder"],
          ["appData", "_appDataFolder"],
          ["userData", "_userDataFolder"],
          ["localAppData", "_localAppDataFolder"],
          ["localUserData", "_localUserDataFolder"],
          ["sessionData", "_sessionDataFolder"],
          ["temp", "_tempFolder"],
          ["exe", "_exeFolder"],
          ["module", "_moduleFolder"],
          ["desktop", "_desktopFolder"],
          ["documents", "_documentsFolder"],
          ["downloads", "_downloadsFolder"],
          ["music", "_musicFolder"],
          ["pictures", "_picturesFolder"],
          ["videos", "_videosFolder"],
          ["recent", "_recentFolder"],
          ["logs", "_logsFolder"],
          ["crashDumps", "_crashDumpsFolder"],
          // app.getAppPath
          ["app", "_appFolder"],
          ["project", "_projectFilesFolder"]
        ];
        const promises = [];
        for (const name of paths) {
          promises.push(async () => {
            const orderPath = {
              url: "/paths",
              body: {
                name: name[0]
              }
            };
            const pathFolder = await this.ws?.sendAndWaitForResponse(orderPath);
            if (pathFolder) {
              this[name[1]] = pathFolder.body.data;
            }
          });
        }
        promises.push(async () => {
          const order = {
            url: "/steam/raw",
            body: {
              namespace: "localplayer",
              method: "getSteamId",
              args: []
            }
          };
          const response = await this.ws?.sendAndWaitForResponse(order);
          this._steam_SteamId = response?.body.data ?? defaultSteamId;
        });
        promises.push(async () => {
          const order = {
            url: "/steam/raw",
            body: {
              namespace: "localplayer",
              method: "getName",
              args: []
            }
          };
          const response = await this.ws?.sendAndWaitForResponse(order);
          this._steam_Name = response?.body.data ?? "";
        });
        promises.push(async () => {
          const order = {
            url: "/steam/raw",
            body: {
              namespace: "localplayer",
              method: "getLevel",
              args: []
            }
          };
          const response = await this.ws?.sendAndWaitForResponse(order);
          this._steam_Level = response?.body.data ?? -1;
        });
        promises.push(async () => {
          const order = {
            url: "/steam/raw",
            body: {
              namespace: "localplayer",
              method: "getIpCountry",
              args: []
            }
          };
          const response = await this.ws?.sendAndWaitForResponse(order);
          this._steam_IpCountry = response?.body.data ?? "";
        });
        promises.push(async () => {
          const order = {
            url: "/steam/raw",
            body: {
              namespace: "utils",
              method: "isSteamRunningOnSteamDeck",
              args: []
            }
          };
          const response = await this.ws?.sendAndWaitForResponse(order);
          this._steam_IsRunningOnSteamDeck = response?.body.data ?? false;
        });
        promises.push(async () => {
          const order = {
            url: "/infos",
            body: {}
          };
          const response = await this.ws?.sendAndWaitForResponse(order);
          this._platform = response?.body.platform ?? "";
          this._arch = response?.body.arch ?? "";
        });
        promises.push(async () => {
          const order = {
            url: "/steam/raw",
            body: {
              namespace: "utils",
              method: "getAppId",
              args: []
            }
          };
          const response = await this.ws?.sendAndWaitForResponse(order);
          this._steam_AppId = response?.body.data ?? -1;
        });
        const results = await Promise.allSettled(promises.map((x) => x()));
        const orderEngine = {
          url: "/engine"
        };
        const engineResponse = await this.ws.sendAndWaitForResponse(orderEngine);
        if (engineResponse) {
          this._engine = engineResponse.body.engine;
        }
        this._isInitialized = true;
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnInitializeSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyInitializeSuccess
        ]);
      } catch (e) {
        console.error(e);
        this._isInitialized = false;
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnInitializeError,
          C32.Plugins.pipelabv2.Cnds.OnAnyInitializeError
        ]);
      }
    }, this.unsupportedEngine, true, true);
    _WriteTextFile = this.wrap(super._WriteTextFile, async (path, contents, tag) => {
      try {
        const order = {
          url: "/fs/file/write",
          body: {
            path,
            contents,
            encoding: "utf8"
          }
        };
        const response = await this.ws?.sendAndWaitForResponse(order);
        this._WriteTextFileResultValue = true;
        this._WriteTextFileErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnWriteTextFileSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyWriteTextFileSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._WriteTextFileErrorValue = e.message;
          this._WriteTextFileResultValue = false;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnWriteTextFileError,
            C32.Plugins.pipelabv2.Cnds.OnAnyWriteTextFileError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _WriteText = this._WriteTextFile;
    _ReadTextFile = this.wrap(super._ReadTextFile, async (path, tag) => {
      try {
        const order = {
          url: "/fs/file/read",
          body: {
            path,
            encoding: "utf8"
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ReadTextFileResultValue = answer?.body.content;
        this._ReadTextFileErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnReadTextFileSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyReadTextFileSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ReadTextFileErrorValue = e.message;
          this._ReadTextFileResultValue = false;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnReadTextFileError,
            C32.Plugins.pipelabv2.Cnds.OnAnyReadTextFileError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _CheckIfPathExist = this.wrap(super._CheckIfPathExist, async (path, tag) => {
      try {
        const order = {
          url: "/fs/exist",
          body: {
            path
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._CheckIfPathExistResultValue = answer?.body.success ?? false;
        this._CheckIfPathExistErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnCheckIfPathExistSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyCheckIfPathExistSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._CheckIfPathExistErrorValue = e.message;
          this._CheckIfPathExistResultValue = false;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnCheckIfPathExistError,
            C32.Plugins.pipelabv2.Cnds.OnAnyCheckIfPathExistError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _Maximize = this.wrap(super._Maximize, async () => {
      const order = {
        url: "/window/maximize"
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _Minimize = this.wrap(super._Minimize, async () => {
      const order = {
        url: "/window/minimize"
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _Restore = this.wrap(super._Restore, async () => {
      const order = {
        url: "/window/restore"
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _RequestAttention = this.wrap(super._RequestAttention, async (mode) => {
      const order = {
        url: "/window/request-attention"
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _SetAlwaysOnTop = this.wrap(super._SetAlwaysOnTop, async (mode) => {
      const order = {
        url: "/window/set-always-on-top",
        body: {
          value: mode === 1 ? true : false
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _SetHeight = this.wrap(super._SetHeight, async (height) => {
      const order = {
        url: "/window/set-height",
        body: {
          value: height
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _SetMaximumSize = this.wrap(super._SetMaximumSize, async (width, height) => {
      const order = {
        url: "/window/set-maximum-size",
        body: {
          height,
          width
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _SetMinimumSize = this.wrap(super._SetMinimumSize, async (width, height) => {
      const order = {
        url: "/window/set-minimum-size",
        body: {
          height,
          width
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _SetResizable = this.wrap(super._SetResizable, async (resizable) => {
      const order = {
        url: "/window/set-resizable",
        body: {
          value: resizable === 1 ? true : false
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _SetTitle = this.wrap(super._SetTitle, async (title) => {
      const order = {
        url: "/window/set-title",
        body: {
          value: title
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _SetWidth = this.wrap(super._SetWidth, async (width) => {
      const order = {
        url: "/window/set-width",
        body: {
          value: width
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _SetX = this.wrap(super._SetX, async (x) => {
      const order = {
        url: "/window/set-x",
        body: {
          value: x
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _SetY = this.wrap(super._SetY, async (y) => {
      const order = {
        url: "/window/set-y",
        body: {
          value: y
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _ShowDevTools = this.wrap(super._ShowDevTools, async (toggle) => {
      const order = {
        url: "/window/show-dev-tools",
        body: {
          value: toggle === 1 ? true : false
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _SetFullscreen = this.wrap(super._SetFullscreen, async (toggle) => {
      const order = {
        url: "/window/set-fullscreen",
        body: {
          value: toggle === 0 ? "normal" : "fullscreen"
        }
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, (toggle) => {
      if (this.c3runtime.platformInfo.exportType === "preview") {
        const state = {
          state: toggle === 0 ? 0 : 1
        };
        this.postToDOM("set-fullscreen", state);
      }
    });
    _Unmaximize = this.wrap(super._Unmaximize, async () => {
      const order = {
        url: "/window/unmaximize"
      };
      await this.ws?.sendAndWaitForResponse(order);
    }, this.unsupportedEngine);
    _ShowFolderDialog = this.wrap(super._ShowFolderDialog, async (tag) => {
      try {
        const order = {
          url: "/dialog/folder"
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ShowFolderDialogResultValue = answer?.body.paths[0];
        this._ShowFolderDialogErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnShowFolderDialogSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyShowFolderDialogSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ShowFolderDialogErrorValue = e.message;
          this._ShowFolderDialogResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnShowFolderDialogError,
            C32.Plugins.pipelabv2.Cnds.OnAnyShowFolderDialogError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _ShowOpenDialog = this.wrap(super._ShowOpenDialog, async (accept, tag) => {
      try {
        const filters = accept.split(",").map((filter) => {
          const [name, extensions] = filter.split("|");
          if (name && extensions) {
            const result = {
              name,
              extensions: extensions.split(";")
            };
            return result;
          }
        }).filter((x) => !!x);
        const order = {
          url: "/dialog/open",
          body: {
            filters
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ShowOpenDialogResultValue = answer?.body.paths[0];
        this._ShowOpenDialogErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnShowOpenDialogSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyShowOpenDialogSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ShowOpenDialogErrorValue = e.message;
          this._ShowOpenDialogResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnShowOpenDialogError,
            C32.Plugins.pipelabv2.Cnds.OnAnyShowOpenDialogError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _ShowSaveDialog = this.wrap(super._ShowSaveDialog, async (accept, tag) => {
      try {
        const filters = accept.split(",").map((filter) => {
          const [name, extensions] = filter.split("|");
          if (name && extensions) {
            const result = {
              name,
              extensions: extensions.split(";")
            };
            return result;
          }
        }).filter((x) => !!x);
        const order = {
          url: "/dialog/save",
          body: {
            filters
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ShowSaveDialogResultValue = answer?.body.path;
        this._ShowSaveDialogErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnShowSaveDialogSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyShowSaveDialogSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ShowSaveDialogErrorValue = e.message;
          this._ShowSaveDialogResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnShowSaveDialogError,
            C32.Plugins.pipelabv2.Cnds.OnAnyShowSaveDialogError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _AppendFile = this.wrap(super._AppendFile, async (path, contents, tag) => {
      try {
        const order = {
          url: "/fs/file/write",
          body: {
            path,
            contents,
            encoding: "utf-8",
            flag: "a"
            // Append
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._AppendFileResultValue = answer?.body.success;
        this._AppendFileErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnAppendFileSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyAppendFileSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._AppendFileErrorValue = e.message;
          this._AppendFileResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnAppendFileError,
            C32.Plugins.pipelabv2.Cnds.OnAnyAppendFileError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _CopyFile = this.wrap(super._CopyFile, async (source, destination, overwrite, tag) => {
      try {
        const order = {
          url: "/fs/copy",
          body: {
            source,
            destination,
            overwrite
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._CopyFileResultValue = answer?.body.success;
        this._CopyFileErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnCopyFileSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyCopyFileSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._CopyFileErrorValue = e.message;
          this._CopyFileResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnCopyFileError,
            C32.Plugins.pipelabv2.Cnds.OnAnyCopyFileError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _CreateFolder = this.wrap(super._CreateFolder, async (path, recursive, tag) => {
      try {
        const order = {
          url: "/fs/folder/create",
          body: {
            path,
            recursive
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._CreateFolderResultValue = answer?.body.success;
        this._CreateFolderErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnCreateFolderSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyCreateFolderSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._CreateFolderErrorValue = e.message;
          this._CreateFolderResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnCreateFolderError,
            C32.Plugins.pipelabv2.Cnds.OnAnyCreateFolderError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _DeleteFile = this.wrap(super._DeleteFile, async (path, recursive, tag) => {
      try {
        const order = {
          url: "/fs/delete",
          body: {
            path,
            recursive
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._DeleteFileResultValue = answer?.body.success;
        this._DeleteFileErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnDeleteFileSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyDeleteFileSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._DeleteFileErrorValue = e.message;
          this._DeleteFileResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnDeleteFileError,
            C32.Plugins.pipelabv2.Cnds.OnAnyDeleteFileError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _ListFiles = this.wrap(super._ListFiles, async (path, recursive, tag) => {
      try {
        const order = {
          url: "/fs/list",
          body: {
            path,
            recursive
          }
        };
        const files = await this.ws?.sendAndWaitForResponse(order);
        if (files?.body.success === false) {
          throw new Error("Failed");
        }
        this._ListFilesResultValue = files?.body.list ?? [];
        this._ListFilesErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnListFilesSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyListFilesSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ListFilesErrorValue = e.message;
          this._ListFilesResultValue = [];
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnListFilesError,
            C32.Plugins.pipelabv2.Cnds.OnAnyListFilesError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _MoveFile = this.wrap(super._MoveFile, async (source, destination, overwrite, tag) => {
      try {
        const order = {
          url: "/fs/move",
          body: {
            source,
            destination,
            overwrite
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._MoveFileResultValue = answer?.body.success;
        this._MoveFileErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnMoveFileSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyMoveFileSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._MoveFileErrorValue = e.message;
          this._MoveFileResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnMoveFileError,
            C32.Plugins.pipelabv2.Cnds.OnAnyMoveFileError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _OpenBrowser = this.wrap(super._OpenBrowser, async () => {
      throw new Error('"_OpenBrowser" Not implemented');
    }, this.unsupportedEngine);
    _ReadBinaryFile = this.wrap(super._ReadBinaryFile, async (path, destination, tag) => {
      try {
        const order = {
          url: "/fs/file/read/binary",
          body: {
            path
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (!sdkInst) {
          throw new Error("SDK instance not found");
        }
        const newBuffer = new Uint8Array(answer?.body.content ?? []);
        sdkInst.setArrayBufferCopy(newBuffer.buffer);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ReadBinaryFileResultValue = answer?.body.success;
        this._ReadBinaryFileErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnReadBinaryFileSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyReadBinaryFileSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ReadBinaryFileErrorValue = e.message;
          this._ReadBinaryFileResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnReadBinaryFileError,
            C32.Plugins.pipelabv2.Cnds.OnAnyReadBinaryFileError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _RenameFile = this.wrap(super._RenameFile, async (source, newFileName, overwrite, tag) => {
      try {
        const directory = posixPath.dirname(source);
        const newPath = posixPath.join(directory, newFileName);
        const order = {
          url: "/fs/move",
          body: {
            source,
            destination: newPath,
            overwrite
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._RenameFileResultValue = answer?.body.success;
        this._RenameFileErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnRenameFileSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyRenameFileSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._RenameFileErrorValue = e.message;
          this._RenameFileResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnRenameFileError,
            C32.Plugins.pipelabv2.Cnds.OnAnyRenameFileError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _RunFile = this.wrap(super._RunFile, async (command, tag) => {
      try {
        const order = {
          url: "/run",
          body: {
            command,
            args: []
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._RunFileResultValue = answer?.body.success;
        this._RunFileErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnRunFileSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyRunFileSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._RunFileErrorValue = e.message;
          this._RunFileResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnRunFileError,
            C32.Plugins.pipelabv2.Cnds.OnAnyRunFileError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _ShellOpen = this.wrap(super._ShellOpen, async (path, tag) => {
      try {
        const order = {
          url: "/open",
          body: {
            path
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ShellOpenResultValue = answer?.body.success;
        this._ShellOpenErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnShellOpenSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyShellOpenSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ShellOpenErrorValue = e.message;
          this._ShellOpenResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnShellOpenError,
            C32.Plugins.pipelabv2.Cnds.OnAnyShellOpenError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _ExplorerOpen = this.wrap(super._ExplorerOpen, async (path, tag) => {
      try {
        const order = {
          url: "/show-in-explorer",
          body: {
            path
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ExplorerOpenResultValue = answer?.body.success;
        this._ExplorerOpenErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnExplorerOpenSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyExplorerOpenSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ExplorerOpenErrorValue = e.message;
          this._ExplorerOpenResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnExplorerOpenError,
            C32.Plugins.pipelabv2.Cnds.OnAnyExplorerOpenError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    /**
     * @param {IObjectClass<IInstance>} objectClass
     * @return {IBinaryDataInstance | null} objectClass
     */
    __GetBinaryDataSdkInstance(objectClass) {
      if (!objectClass)
        return null;
      const target = objectClass.getFirstPickedInstance(this._inst);
      if (!target)
        return null;
      return target;
    }
    _WriteBinaryFile = this.wrap(super._WriteBinaryFile, async (path, source) => {
      throw new Error("not supported");
    }, this.unsupportedEngine);
    _FetchFileSize = this.wrap(super._FetchFileSize, async (path, tag) => {
      try {
        const order = {
          url: "/fs/file/size",
          body: {
            path
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._FetchFileSizeResultValue = answer.body.size ?? -1;
        this._FetchFileSizeErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnFetchFileSizeSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyFetchFileSizeSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._FetchFileSizeErrorValue = e.message;
          this._FetchFileSizeResultValue = -1;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnFetchFileSizeError,
            C32.Plugins.pipelabv2.Cnds.OnAnyFetchFileSizeError
          ]);
        }
        console.error(e);
      }
    });
    _ActivateAchievement = this.wrap(super._ActivateAchievement, async (achievement, tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "achievement",
            method: "activate",
            args: [achievement]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ActivateAchievementResultValue = answer?.body.success;
        this._ActivateAchievementErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnActivateAchievementSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyActivateAchievementSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ActivateAchievementErrorValue = e.message;
          this._ActivateAchievementResultValue = -1;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnActivateAchievementError,
            C32.Plugins.pipelabv2.Cnds.OnAnyActivateAchievementError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _ClearAchievement = this.wrap(super._ClearAchievement, async (achievement, tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "achievement",
            method: "clear",
            args: [achievement]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ClearAchievementResultValue = answer?.body.success;
        this._ClearAchievementErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnClearAchievementSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyClearAchievementSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ClearAchievementErrorValue = e.message;
          this._ClearAchievementResultValue = -1;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnClearAchievementError,
            C32.Plugins.pipelabv2.Cnds.OnAnyClearAchievementError
          ]);
        }
        console.error(e);
      }
    }, this.unsupportedEngine);
    _CheckAchievementActivationState = this.wrap(super._CheckAchievementActivationState, async (achievement, tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "achievement",
            method: "isActivated",
            args: [achievement]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._CheckAchievementActivationStateResultValue = answer?.body.data;
        this._CheckAchievementActivationStateErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnCheckAchievementActivationStateSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyCheckAchievementActivationStateSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._CheckAchievementActivationErrorValue = e.message;
          this._CheckAchievementActivationResultValue = -1;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnCheckAchievementActivationStateError,
            C32.Plugins.pipelabv2.Cnds.OnAnyCheckAchievementActivationStateError
          ]);
        }
      }
    }, () => false);
    _LeaderboardUploadScore = this.wrap(super._LeaderboardUploadScore, async (name, score, type, tag) => {
      try {
        const order = {
          url: "/steam/leaderboard/upload-score",
          body: {
            name,
            score,
            type,
            metadata: []
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._LeaderboardUploadScoreResultValue = answer?.body.success;
        this._LeaderboardUploadScoreErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnLeaderboardUploadScoreSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyLeaderboardUploadScoreSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._LeaderboardUploadScoreErrorValue = e.message;
          this._LeaderboardUploadScoreResultValue = -1;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnLeaderboardUploadScoreError,
            C32.Plugins.pipelabv2.Cnds.OnAnyLeaderboardUploadScoreError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _LeaderboardUploadScoreWithMetadata = this.wrap(super._LeaderboardUploadScoreWithMetadata, async (name, score, metadata, type, tag) => {
      const target = metadata.getFirstPickedInstance();
      let result = [];
      if (target) {
        if (target.height === 1) {
          const { width } = target;
          for (let i = 0; i < width; i++) {
            const value = target.getAt(i);
            result.push(typeof value === "string" ? parseInt(value, 10) : value);
          }
        } else {
          console.warn("Array must be a 1 dimentional array. Skipping metadata");
        }
      }
      try {
        const order = {
          url: "/steam/leaderboard/upload-score",
          body: {
            name,
            score,
            type,
            metadata: result
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._LeaderboardUploadScoreWithMetadataResultValue = answer?.body.success;
        this._LeaderboardUploadScoreWithMetadataErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnLeaderboardUploadScoreWithMetadataSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyLeaderboardUploadScoreWithMetadataSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._LeaderboardUploadScoreWithMetadataErrorValue = e.message;
          this._LeaderboardUploadScoreWithMetadataResultValue = -1;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnLeaderboardUploadScoreWithMetadataError,
            C32.Plugins.pipelabv2.Cnds.OnAnyLeaderboardUploadScoreWithMetadataError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _LeaderboardDownloadScore = this.wrap(super._LeaderboardDownloadScore, async (leaderboard, downloadType, start, end, jsonObject, tag) => {
      try {
        const order = {
          url: "/steam/leaderboard/download-score",
          body: {
            name: leaderboard,
            type: downloadType,
            start,
            end
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._LeaderboardDownloadScoreResultValue = answer?.body.success;
        this._LeaderboardDownloadScoreErrorValue = "";
        const jsonInstance = jsonObject.getFirstInstance();
        jsonInstance?.setJsonDataCopy(answer?.body.data);
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnLeaderboardDownloadScoreSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyLeaderboardDownloadScoreSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._LeaderboardDownloadScoreErrorValue = e.message;
          this._LeaderboardDownloadScoreResultValue = -1;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnLeaderboardDownloadScoreError,
            C32.Plugins.pipelabv2.Cnds.OnAnyLeaderboardDownloadScoreError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _SetRichPresence = this.wrap(super._SetRichPresence, async (key, value, tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "localplayer",
            method: "setRichPresence",
            args: [key, value]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._SetRichPresenceResultValue = answer?.body.data;
        this._SetRichPresenceErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnSetRichPresenceSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnySetRichPresenceSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._SetRichPresenceErrorValue = e.message;
          this._SetRichPresenceResultValue = -1;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnSetRichPresenceError,
            C32.Plugins.pipelabv2.Cnds.OnAnySetRichPresenceError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _DiscordSetActivity = this.wrap(super._SetRichPresence, async (details, state, startTimestamp, largeImageKey, largeImageText, smallImageKey, smallImageText, tag) => {
      try {
        const order = {
          url: "/discord/set-activity",
          body: {
            details,
            state,
            startTimestamp,
            largeImageKey,
            largeImageText,
            smallImageKey,
            smallImageText
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._DiscordSetActivityResultValue = answer?.body.success;
        this._DiscordSetActivityErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnDiscordSetActivitySuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyDiscordSetActivitySuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._DiscordSetActivityErrorValue = e.message;
          this._DiscordSetActivityResultValue = false;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnDiscordSetActivityError,
            C32.Plugins.pipelabv2.Cnds.OnAnyDiscordSetActivityError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _ActivateToWebPage = this.wrap(super._ActivateToWebPage, async (url, mode, tag) => {
      try {
        const steamMode = mode === 1 ? 1 : 0;
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "overlay",
            method: "activateToWebPage",
            args: [url, steamMode]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ActivateToWebPageResultValue = answer?.body.success ?? false;
        this._ActivateToWebPageErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnActivateToWebPageSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyActivateToWebPageSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ActivateToWebPageErrorValue = e.message;
          this._ActivateToWebPageResultValue = false;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnActivateToWebPageError,
            C32.Plugins.pipelabv2.Cnds.OnAnyActivateToWebPageError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _ActivateToStore = this.wrap(super._ActivateToStore, async (appId, flag, tag) => {
      try {
        const steamFlag = flag === 1 ? 2 : 0;
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "overlay",
            method: "activateToStore",
            args: [appId, steamFlag]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ActivateToStoreResultValue = answer?.body.success ?? false;
        this._ActivateToStoreErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnActivateToStoreSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyActivateToStoreSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ActivateToStoreErrorValue = e.message;
          this._ActivateToStoreResultValue = false;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnActivateToStoreError,
            C32.Plugins.pipelabv2.Cnds.OnAnyActivateToStoreError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetSteamUILanguage = this.wrap(super._GetSteamUILanguage, async (tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "utils",
            method: "getSteamUiLanguage",
            args: []
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._GetSteamUILanguageResultValue = answer?.body.data ?? "";
        this._GetSteamUILanguageErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetSteamUILanguageSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetSteamUILanguageSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetSteamUILanguageErrorValue = e.message;
          this._GetSteamUILanguageResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetSteamUILanguageError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetSteamUILanguageError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetAvailableGameLanguages = this.wrap(super._GetAvailableGameLanguages, async (tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "apps",
            method: "availableGameLanguages",
            args: []
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        const data = answer?.body.data;
        this._GetAvailableGameLanguagesResultValue = Array.isArray(data) ? data.join(",") : data ?? "";
        this._GetAvailableGameLanguagesErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetAvailableGameLanguagesSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetAvailableGameLanguagesSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetAvailableGameLanguagesErrorValue = e.message;
          this._GetAvailableGameLanguagesResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetAvailableGameLanguagesError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetAvailableGameLanguagesError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetCurrentGameLanguage = this.wrap(super._GetCurrentGameLanguage, async (tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "apps",
            method: "currentGameLanguage",
            args: []
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._GetCurrentGameLanguageResultValue = answer?.body.data ?? "";
        this._GetCurrentGameLanguageErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetCurrentGameLanguageSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetCurrentGameLanguageSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetCurrentGameLanguageErrorValue = e.message;
          this._GetCurrentGameLanguageResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetCurrentGameLanguageError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetCurrentGameLanguageError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetFriends = this.wrap(super._GetFriends, async (flagsIdx, jsonObject, tag) => {
      try {
        const flags = friendFlagsMap[flagsIdx] ?? 0;
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "friends",
            method: "getFriends",
            args: [flags]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._friendsList = answer?.body.data ?? [];
        this._GetFriendsResultValue = JSON.stringify(this._friendsList);
        this._GetFriendsErrorValue = "";
        const jsonInstance = jsonObject.getFirstInstance();
        jsonInstance?.setJsonDataCopy(answer?.body.data ?? []);
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetFriendsSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetFriendsSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetFriendsErrorValue = e.message;
          this._friendsList = [];
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetFriendsError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetFriendsError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetFriendName = this.wrap(super._GetFriendName, async (steamId64, tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "friends",
            method: "getFriendName",
            args: [steamId64]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._GetFriendNameResultValue = answer?.body.data ?? "";
        this._GetFriendNameErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetFriendNameSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetFriendNameSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetFriendNameErrorValue = e.message;
          this._GetFriendNameResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetFriendNameError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetFriendNameError
          ]);
        }
      }
    }, this.unsupportedEngine);
    // Steam Screenshots
    _TriggerScreenshot = this.wrap(super._TriggerScreenshot, async (tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "screenshots",
            method: "triggerScreenshot",
            args: []
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._TriggerScreenshotResultValue = answer?.body.data;
        this._TriggerScreenshotErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnTriggerScreenshotSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyTriggerScreenshotSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._TriggerScreenshotErrorValue = e.message;
          this._TriggerScreenshotResultValue = -1;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnTriggerScreenshotError,
            C32.Plugins.pipelabv2.Cnds.OnAnyTriggerScreenshotError
          ]);
        }
      }
    }, this.unsupportedEngine);
    // Save Screenshot from URL
    _SaveScreenshotFromURL = this.wrap(super._SaveScreenshotFromURL, async (url, tag) => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        const imageLoaded = new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = (e) => reject(new Error("Failed to load image from URL"));
        });
        img.src = url;
        await imageLoaded;
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to get canvas context");
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        const order = {
          url: "/steam/screenshots/save",
          body: {
            dataUrl,
            width,
            height
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error(answer?.body.error || "Failed to save screenshot");
        }
        this._SaveScreenshotFromURLResultValue = answer?.body.data ?? "";
        this._SaveScreenshotFromURLErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnSaveScreenshotFromURLSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnySaveScreenshotFromURLSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._SaveScreenshotFromURLErrorValue = e.message;
          this._SaveScreenshotFromURLResultValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnSaveScreenshotFromURLError,
            C32.Plugins.pipelabv2.Cnds.OnAnySaveScreenshotFromURLError
          ]);
        }
      }
    }, this.unsupportedEngine);
    // Add Screenshot to Library
    _AddScreenshotToLibrary = this.wrap(super._AddScreenshotToLibrary, async (filename, thumbnailFilename, width, height, tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "screenshots",
            method: "addScreenshotToLibrary",
            args: [filename, thumbnailFilename || null, width, height]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error(answer?.body.error || "Failed to add screenshot to library");
        }
        this._AddScreenshotToLibraryResultValue = answer?.body.data ?? -1;
        this._AddScreenshotToLibraryErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnAddScreenshotToLibrarySuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyAddScreenshotToLibrarySuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._AddScreenshotToLibraryErrorValue = e.message;
          this._AddScreenshotToLibraryResultValue = -1;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnAddScreenshotToLibraryError,
            C32.Plugins.pipelabv2.Cnds.OnAnyAddScreenshotToLibraryError
          ]);
        }
      }
    }, this.unsupportedEngine);
    // Steam DLC
    _CheckDLCIsInstalled = this.wrap(super._CheckDLCIsInstalled, async (appId, tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "apps",
            method: "isDlcInstalled",
            args: [appId]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._CheckDLCIsInstalledResultValue = answer?.body.data ? 1 : 0;
        this._CheckDLCIsInstalledErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnCheckDLCIsInstalledSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyCheckDLCIsInstalledSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._CheckDLCIsInstalledErrorValue = e.message;
          this._CheckDLCIsInstalledResultValue = 0;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnCheckDLCIsInstalledError,
            C32.Plugins.pipelabv2.Cnds.OnAnyCheckDLCIsInstalledError
          ]);
        }
      }
    }, this.unsupportedEngine);
    // Steam Gamepad Text Input
    _ShowGamepadTextInputBase = this.wrap(super._ShowGamepadTextInput, async (inputMode, inputLineMode, description, maxCharacters, existingText, tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "utils",
            method: "showGamepadTextInput",
            args: [inputMode, inputLineMode, description, maxCharacters, existingText || void 0]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ShowGamepadTextInputResultValue = answer?.body.data ?? null;
        this._ShowGamepadTextInputErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnShowGamepadTextInputSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyShowGamepadTextInputSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ShowGamepadTextInputErrorValue = e.message;
          this._ShowGamepadTextInputResultValue = null;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnShowGamepadTextInputError,
            C32.Plugins.pipelabv2.Cnds.OnAnyShowGamepadTextInputError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _ShowGamepadTextInput = this._ShowGamepadTextInputBase;
    _ShowGamepadTextInputSync = this._ShowGamepadTextInputBase;
    _ShowFloatingGamepadTextInputBase = this.wrap(super._ShowFloatingGamepadTextInput, async (keyboardMode, x, y, width, height, tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "utils",
            method: "showFloatingGamepadTextInput",
            args: [keyboardMode, x, y, width, height]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._ShowFloatingGamepadTextInputResultValue = answer?.body.data ? 1 : 0;
        this._ShowFloatingGamepadTextInputErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnShowFloatingGamepadTextInputSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyShowFloatingGamepadTextInputSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._ShowFloatingGamepadTextInputErrorValue = e.message;
          this._ShowFloatingGamepadTextInputResultValue = 0;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnShowFloatingGamepadTextInputError,
            C32.Plugins.pipelabv2.Cnds.OnAnyShowFloatingGamepadTextInputError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _ShowFloatingGamepadTextInput = this._ShowFloatingGamepadTextInputBase;
    _ShowFloatingGamepadTextInputSync = this._ShowFloatingGamepadTextInputBase;
    // Steam Workshop
    /** @type {Map<string, any>} */
    _workshopItemsMap = /* @__PURE__ */ new Map();
    /** @type {string[]} */
    _subscribedItemIds = [];
    // Helper functions for modular API calls
    /**
     * Get the state of a workshop item
     * @param {string | number} itemId - The workshop item ID
     * @returns {Promise<number>} The item state
     */
    async _getItemState(itemId) {
      const order = {
        url: "/steam/workshop/state",
        body: {
          itemId
        }
      };
      const answer = await this.ws?.sendAndWaitForResponse(order);
      return answer?.body.data ?? 0;
    }
    /**
     * Get the install info of a workshop item
     * @param {string | number} itemId - The workshop item ID
     * @returns {Promise<any>} The install info
     */
    async _getItemInstallInfo(itemId) {
      const order = {
        url: "/steam/workshop/install-info",
        body: {
          itemId
        }
      };
      const answer = await this.ws?.sendAndWaitForResponse(order);
      return answer?.body.data;
    }
    /**
     * Get the download info of a workshop item
     * @param {string | number} itemId - The workshop item ID
     * @returns {Promise<any>} The download info
     */
    async _getItemDownloadInfo(itemId) {
      const order = {
        url: "/steam/workshop/download-info",
        body: {
          itemId
        }
      };
      const answer = await this.ws?.sendAndWaitForResponse(order);
      return answer?.body.data;
    }
    _CreateWorkshopItem = this.wrap(super._CreateWorkshopItem, async (appID, tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "workshop",
            method: "createItem",
            args: [appID]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        const result = answer?.body.data;
        this._CreateWorkshopItemResultValue = result?.itemId?.toString() ?? "";
        this._CreateWorkshopItemNeedsAgreementValue = result?.needsToAcceptAgreement ? 1 : 0;
        this._CreateWorkshopItemErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnCreateWorkshopItemSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyCreateWorkshopItemSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._CreateWorkshopItemErrorValue = e.message;
          this._CreateWorkshopItemResultValue = "";
          this._CreateWorkshopItemNeedsAgreementValue = 0;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnCreateWorkshopItemError,
            C32.Plugins.pipelabv2.Cnds.OnAnyCreateWorkshopItemError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _UpdateWorkshopItem = this.wrap(super._UpdateWorkshopItem, async (appID, itemId, updateTitle, title, updateDescription, description, updateContent, contentFolderPath, changeNote, updatePreview, previewImagePath, updateTags, tags, updateVisibility, visibility, tag) => {
      try {
        const updateDetails = {};
        if (updateTitle) {
          updateDetails.title = title;
        }
        if (updateDescription) {
          updateDetails.description = description;
        }
        if (updateContent) {
          updateDetails.contentPath = contentFolderPath;
        }
        if (updatePreview) {
          updateDetails.previewPath = previewImagePath;
        }
        if (updateTags) {
          const tagArray = tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
          updateDetails.tags = tagArray;
        }
        if (updateVisibility) {
          updateDetails.visibility = visibility;
        }
        if (changeNote) {
          updateDetails.changeNote = changeNote;
        }
        const order = {
          url: "/steam/workshop/update-item",
          body: {
            itemId,
            updateDetails,
            appID
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        const result = answer?.body.data;
        this._UpdateWorkshopItemResultValue = result?.itemId?.toString() ?? "";
        this._UpdateWorkshopItemNeedsAgreementValue = result?.needsToAcceptAgreement ? 1 : 0;
        this._UpdateWorkshopItemErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnUpdateWorkshopItemSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyUpdateWorkshopItemSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._UpdateWorkshopItemErrorValue = e.message;
          this._UpdateWorkshopItemResultValue = "";
          this._UpdateWorkshopItemNeedsAgreementValue = 0;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnUpdateWorkshopItemError,
            C32.Plugins.pipelabv2.Cnds.OnAnyUpdateWorkshopItemError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetSubscribedItemsWithMetadata = this.wrap(super._GetSubscribedItemsWithMetadata, async (tag) => {
      try {
        const orderSubscribed = {
          url: "/steam/raw",
          body: {
            namespace: "workshop",
            method: "getSubscribedItems",
            args: [false]
          }
        };
        const subscribedAnswer = await this.ws?.sendAndWaitForResponse(orderSubscribed);
        if (subscribedAnswer?.body.success === false) {
          throw new Error("Failed to get subscribed items");
        }
        const itemIds = subscribedAnswer?.body.data ?? [];
        this._subscribedItemIds = itemIds.map((id) => id.toString());
        if (itemIds.length === 0) {
          this._GetSubscribedItemsWithMetadataErrorValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetSubscribedItemsWithMetadataSuccess,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetSubscribedItemsWithMetadataSuccess
          ]);
          return;
        }
        const orderMetadata = {
          url: "/steam/workshop/get-items",
          body: {
            itemIds
          }
        };
        const metadataAnswer = await this.ws?.sendAndWaitForResponse(orderMetadata);
        if (metadataAnswer?.body.success === false) {
          throw new Error("Failed to get item metadata");
        }
        const items = metadataAnswer?.body.data?.items ?? [];
        for (const item of items) {
          if (!item) continue;
          const itemIdStr = item.publishedFileId.toString();
          const state = await this._getItemState(item.publishedFileId);
          const installInfo = await this._getItemInstallInfo(item.publishedFileId);
          let downloadInfo = null;
          if (state && state & 16) {
            downloadInfo = await this._getItemDownloadInfo(item.publishedFileId);
          }
          this._workshopItemsMap.set(itemIdStr, {
            ...item,
            state,
            installInfo,
            downloadInfo
          });
        }
        this._GetSubscribedItemsWithMetadataErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetSubscribedItemsWithMetadataSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetSubscribedItemsWithMetadataSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetSubscribedItemsWithMetadataErrorValue = e.message;
          this._subscribedItemIds = [];
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetSubscribedItemsWithMetadataError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetSubscribedItemsWithMetadataError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _DownloadWorkshopItem = this.wrap(super._DownloadWorkshopItem, async (itemId, highPriority, tag) => {
      try {
        const order = {
          url: "/steam/workshop/download",
          body: {
            itemId,
            highPriority: highPriority ?? false
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._DownloadWorkshopItemResultValue = answer?.body.data ? 1 : 0;
        this._DownloadWorkshopItemErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnDownloadWorkshopItemSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyDownloadWorkshopItemSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._DownloadWorkshopItemErrorValue = e.message;
          this._DownloadWorkshopItemResultValue = 0;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnDownloadWorkshopItemError,
            C32.Plugins.pipelabv2.Cnds.OnAnyDownloadWorkshopItemError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _DeleteWorkshopItem = this.wrap(super._DeleteWorkshopItem, async (itemId, tag) => {
      try {
        const order = {
          url: "/steam/workshop/delete-item",
          body: {
            itemId
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._DeleteWorkshopItemResultValue = answer?.body.data ? 1 : 0;
        this._DeleteWorkshopItemErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnDeleteWorkshopItemSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyDeleteWorkshopItemSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._DeleteWorkshopItemErrorValue = e.message;
          this._DeleteWorkshopItemResultValue = 0;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnDeleteWorkshopItemError,
            C32.Plugins.pipelabv2.Cnds.OnAnyDeleteWorkshopItemError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _SubscribeWorkshopItem = this.wrap(super._SubscribeWorkshopItem, async (itemId, tag) => {
      try {
        const order = {
          url: "/steam/workshop/subscribe",
          body: {
            itemId
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._SubscribeWorkshopItemResultValue = answer?.body.data ? 1 : 0;
        this._SubscribeWorkshopItemErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnSubscribeWorkshopItemSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnySubscribeWorkshopItemSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._SubscribeWorkshopItemErrorValue = e.message;
          this._SubscribeWorkshopItemResultValue = 0;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnSubscribeWorkshopItemError,
            C32.Plugins.pipelabv2.Cnds.OnAnySubscribeWorkshopItemError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _UnsubscribeWorkshopItem = this.wrap(super._UnsubscribeWorkshopItem, async (itemId, tag) => {
      try {
        const order = {
          url: "/steam/workshop/unsubscribe",
          body: {
            itemId
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        this._UnsubscribeWorkshopItemResultValue = answer?.body.data ? 1 : 0;
        this._UnsubscribeWorkshopItemErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnUnsubscribeWorkshopItemSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyUnsubscribeWorkshopItemSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._UnsubscribeWorkshopItemErrorValue = e.message;
          this._UnsubscribeWorkshopItemResultValue = 0;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnUnsubscribeWorkshopItemError,
            C32.Plugins.pipelabv2.Cnds.OnAnyUnsubscribeWorkshopItemError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetWorkshopItemState = this.wrap(super._GetWorkshopItemState, async (itemId, tag) => {
      try {
        const order = {
          url: "/steam/workshop/state",
          body: {
            itemId
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        const state = answer?.body.data ?? 0;
        this._GetWorkshopItemStateResultValue = state;
        this._GetWorkshopItemStateErrorValue = "";
        if (existingItem) {
          existingItem.state = state;
        } else {
          this._workshopItemsMap.set(itemId, { state });
        }
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemStateSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemStateSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetWorkshopItemStateErrorValue = e.message;
          this._GetWorkshopItemStateResultValue = 0;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemStateError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemStateError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetWorkshopItemInstallInfo = this.wrap(super._GetWorkshopItemInstallInfo, async (itemId, tag) => {
      try {
        const order = {
          url: "/steam/workshop/install-info",
          body: {
            itemId
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        const installInfo = answer?.body.data;
        this._lastInstallInfo = installInfo;
        this._GetWorkshopItemInstallInfoErrorValue = "";
        if (existingItem) {
          existingItem.installInfo = installInfo;
        } else {
          this._workshopItemsMap.set(itemId, { installInfo });
        }
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemInstallInfoSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemInstallInfoSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetWorkshopItemInstallInfoErrorValue = e.message;
          this._lastInstallInfo = null;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemInstallInfoError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemInstallInfoError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetWorkshopItemDownloadInfo = this.wrap(super._GetWorkshopItemDownloadInfo, async (itemId, tag) => {
      try {
        const order = {
          url: "/steam/workshop/download-info",
          body: {
            itemId
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed");
        }
        const downloadInfo = answer?.body.data;
        this._lastDownloadInfo = downloadInfo;
        this._GetWorkshopItemDownloadInfoErrorValue = "";
        if (existingItem) {
          existingItem.downloadInfo = downloadInfo;
        } else {
          this._workshopItemsMap.set(itemId, { downloadInfo });
        }
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemDownloadInfoSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemDownloadInfoSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetWorkshopItemDownloadInfoErrorValue = e.message;
          this._lastDownloadInfo = null;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemDownloadInfoError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemDownloadInfoError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetWorkshopItem = this.wrap(super._GetWorkshopItem, async (itemId, tag) => {
      try {
        const order = {
          url: "/steam/workshop/get-item",
          body: {
            itemId
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed to get item");
        }
        const item = answer?.body.data;
        if (item) {
          const itemIdStr = item.publishedFileId.toString();
          if (existingItem) {
            this._workshopItemsMap.set(itemIdStr, { ...existingItem, ...item });
          } else {
            this._workshopItemsMap.set(itemIdStr, item);
          }
        }
        this._GetWorkshopItemErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetWorkshopItemErrorValue = e.message;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetWorkshopItems = this.wrap(super._GetWorkshopItems, async (itemIds, tag) => {
      try {
        const itemIdArray = itemIds.split(",").map((id) => id.trim()).filter((id) => id.length > 0);
        if (itemIdArray.length === 0) {
          this._GetWorkshopItemsErrorValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemsSuccess,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemsSuccess
          ]);
          return;
        }
        const order = {
          url: "/steam/workshop/get-items",
          body: {
            itemIds: itemIdArray
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed to get items");
        }
        const items = answer?.body.data?.items ?? [];
        for (const item of items) {
          if (!item) continue;
          const itemIdStr = item.publishedFileId.toString();
          if (existingItem) {
            this._workshopItemsMap.set(itemIdStr, { ...existingItem, ...item });
          } else {
            this._workshopItemsMap.set(itemIdStr, item);
          }
        }
        this._GetWorkshopItemsErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemsSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemsSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetWorkshopItemsErrorValue = e.message;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemsError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemsError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetSubscribedWorkshopItems = this.wrap(super._GetSubscribedWorkshopItems, async (tag) => {
      try {
        const order = {
          url: "/steam/raw",
          body: {
            namespace: "workshop",
            method: "getSubscribedItems",
            args: [false]
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed to get subscribed items");
        }
        const itemIds = answer?.body.data ?? [];
        this._subscribedItemIds = itemIds.map((id) => id.toString());
        this._GetSubscribedWorkshopItemsErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetSubscribedWorkshopItemsSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetSubscribedWorkshopItemsSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetSubscribedWorkshopItemsErrorValue = e.message;
          this._subscribedItemIds = [];
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetSubscribedWorkshopItemsError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetSubscribedWorkshopItemsError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetWorkshopItemWithMetadata = this.wrap(super._GetWorkshopItemWithMetadata, async (itemId, tag) => {
      try {
        const order = {
          url: "/steam/workshop/get-item",
          body: {
            itemId
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed to get item");
        }
        const item = answer?.body.data;
        if (item) {
          const itemIdStr = item.publishedFileId.toString();
          const state = await this._getItemState(item.publishedFileId);
          const installInfo = await this._getItemInstallInfo(item.publishedFileId);
          let downloadInfo = null;
          if (state && state & 16) {
            downloadInfo = await this._getItemDownloadInfo(item.publishedFileId);
          }
          this._workshopItemsMap.set(itemIdStr, {
            ...item,
            state,
            installInfo,
            downloadInfo
          });
        }
        this._GetWorkshopItemWithMetadataErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemWithMetadataSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemWithMetadataSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetWorkshopItemWithMetadataErrorValue = e.message;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemWithMetadataError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemWithMetadataError
          ]);
        }
      }
    }, this.unsupportedEngine);
    _GetWorkshopItemsWithMetadata = this.wrap(super._GetWorkshopItemsWithMetadata, async (itemIds, tag) => {
      try {
        const itemIdArray = itemIds.split(",").map((id) => id.trim()).filter((id) => id.length > 0);
        if (itemIdArray.length === 0) {
          this._GetWorkshopItemsWithMetadataErrorValue = "";
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemsWithMetadataSuccess,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemsWithMetadataSuccess
          ]);
          return;
        }
        const order = {
          url: "/steam/workshop/get-items",
          body: {
            itemIds: itemIdArray
          }
        };
        const answer = await this.ws?.sendAndWaitForResponse(order);
        if (answer?.body.success === false) {
          throw new Error("Failed to get item metadata");
        }
        const items = answer?.body.data?.items ?? [];
        for (const item of items) {
          if (!item) continue;
          const itemIdStr = item.publishedFileId.toString();
          const state = await this._getItemState(item.publishedFileId);
          const installInfo = await this._getItemInstallInfo(item.publishedFileId);
          let downloadInfo = null;
          if (state && state & 16) {
            downloadInfo = await this._getItemDownloadInfo(item.publishedFileId);
          }
          this._workshopItemsMap.set(itemIdStr, {
            ...item,
            state,
            installInfo,
            downloadInfo
          });
        }
        this._GetWorkshopItemsWithMetadataErrorValue = "";
        await this.trigger(tag, [
          C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemsWithMetadataSuccess,
          C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemsWithMetadataSuccess
        ]);
      } catch (e) {
        if (e instanceof Error) {
          this._GetWorkshopItemsWithMetadataErrorValue = e.message;
          await this.trigger(tag, [
            C32.Plugins.pipelabv2.Cnds.OnGetWorkshopItemsWithMetadataError,
            C32.Plugins.pipelabv2.Cnds.OnAnyGetWorkshopItemsWithMetadataError
          ]);
        }
      }
    }, this.unsupportedEngine);
    // #region Cnds
    _OnInitializeSuccess = this.wrap(super._OnInitializeSuccess, (tag) => {
      return this._currentTag === tag;
    });
    _OnAnyInitializeSuccess = this.wrap(super._OnAnyInitializeSuccess, () => {
      return true;
    });
    _OnInitializeError = this.wrap(super._OnInitializeError, (tag) => this._currentTag === tag);
    _OnAnyInitializeError = this.wrap(super._OnAnyInitializeError, () => {
      return true;
    });
    _OnAppendFileSuccess = this.wrap(super._OnAppendFileSuccess, (tag) => this._currentTag === tag);
    _OnAnyAppendFileSuccess = this.wrap(super._OnAnyAppendFileSuccess, () => {
      return true;
    });
    _OnAppendFileError = this.wrap(super._OnAppendFileError, (tag) => this._currentTag === tag);
    _OnAnyAppendFileError = this.wrap(super._OnAnyAppendFileError, () => {
      return true;
    });
    _OnCopyFileSuccess = this.wrap(super._OnCopyFileSuccess, (tag) => this._currentTag === tag);
    _OnAnyCopyFileSuccess = this.wrap(super._OnAnyCopyFileSuccess, () => {
      return true;
    });
    _OnCopyFileError = this.wrap(super._OnCopyFileError, (tag) => this._currentTag === tag);
    _OnAnyCopyFileError = this.wrap(super._OnAnyCopyFileError, () => {
      return true;
    });
    _OnFetchFileSizeSuccess = this.wrap(super._OnFetchFileSizeSuccess, (tag) => this._currentTag === tag);
    _OnAnyFetchFileSizeSuccess = this.wrap(super._OnAnyFetchFileSizeSuccess, () => {
      return true;
    });
    _OnFetchFileSizeError = this.wrap(super._OnFetchFileSizeError, (tag) => this._currentTag === tag);
    _OnAnyFetchFileSizeError = this.wrap(super._OnAnyFetchFileSizeError, () => {
      return true;
    });
    _OnCreateFolderSuccess = this.wrap(super._OnCreateFolderSuccess, (tag) => this._currentTag === tag);
    _OnAnyCreateFolderSuccess = this.wrap(super._OnAnyCreateFolderSuccess, () => {
      return true;
    });
    _OnCreateFolderError = this.wrap(super._OnCreateFolderError, (tag) => this._currentTag === tag);
    _OnAnyCreateFolderError = this.wrap(super._OnAnyCreateFolderError, () => {
      return true;
    });
    _OnDeleteFileSuccess = this.wrap(super._OnDeleteFileSuccess, (tag) => this._currentTag === tag);
    _OnAnyDeleteFileSuccess = this.wrap(super._OnAnyDeleteFileSuccess, () => {
      return true;
    });
    _OnDeleteFileError = this.wrap(super._OnDeleteFileError, (tag) => this._currentTag === tag);
    _OnAnyDeleteFileError = this.wrap(super._OnAnyDeleteFileError, () => {
      return true;
    });
    _OnListFilesSuccess = this.wrap(super._OnListFilesSuccess, (tag) => this._currentTag === tag);
    _OnAnyListFilesSuccess = this.wrap(super._OnAnyListFilesSuccess, () => {
      return true;
    });
    _OnListFilesError = this.wrap(super._OnListFilesError, (tag) => this._currentTag === tag);
    _OnAnyListFilesError = this.wrap(super._OnAnyListFilesError, () => {
      return true;
    });
    _OnMoveFileSuccess = this.wrap(super._OnMoveFileSuccess, (tag) => this._currentTag === tag);
    _OnAnyMoveFileSuccess = this.wrap(super._OnAnyMoveFileSuccess, () => {
      return true;
    });
    _OnMoveFileError = this.wrap(super._OnMoveFileError, (tag) => this._currentTag === tag);
    _OnAnyMoveFileError = this.wrap(super._OnAnyMoveFileError, () => {
      return true;
    });
    _OnOpenBrowserSuccess = this.wrap(super._OnOpenBrowserSuccess, (tag) => this._currentTag === tag);
    _OnAnyOpenBrowserSuccess = this.wrap(super._OnAnyOpenBrowserSuccess, () => {
      return true;
    });
    _OnOpenBrowserError = this.wrap(super._OnOpenBrowserError, (tag) => this._currentTag === tag);
    _OnAnyOpenBrowserError = this.wrap(super._OnAnyOpenBrowserError, () => {
      return true;
    });
    _OnReadBinaryFileSuccess = this.wrap(super._OnReadBinaryFileSuccess, (tag) => this._currentTag === tag);
    _OnAnyReadBinaryFileSuccess = this.wrap(super._OnAnyReadBinaryFileSuccess, () => {
      return true;
    });
    _OnReadBinaryFileError = this.wrap(super._OnReadBinaryFileError, (tag) => this._currentTag === tag);
    _OnAnyReadBinaryFileError = this.wrap(super._OnAnyReadBinaryFileError, () => {
      return true;
    });
    _OnRenameFileSuccess = this.wrap(super._OnRenameFileSuccess, (tag) => this._currentTag === tag);
    _OnAnyRenameFileSuccess = this.wrap(super._OnAnyRenameFileSuccess, () => {
      return true;
    });
    _OnRenameFileError = this.wrap(super._OnRenameFileError, (tag) => this._currentTag === tag);
    _OnAnyRenameFileError = this.wrap(super._OnAnyRenameFileError, () => {
      return true;
    });
    _OnRunFileSuccess = this.wrap(super._OnRunFileSuccess, (tag) => this._currentTag === tag);
    _OnAnyRunFileSuccess = this.wrap(super._OnAnyRunFileSuccess, () => {
      return true;
    });
    _OnRunFileError = this.wrap(super._OnRunFileError, (tag) => this._currentTag === tag);
    _OnAnyRunFileError = this.wrap(super._OnAnyRunFileError, () => {
      return true;
    });
    _OnShellOpenSuccess = this.wrap(super._OnShellOpenSuccess, (tag) => this._currentTag === tag);
    _OnAnyShellOpenSuccess = this.wrap(super._OnAnyShellOpenSuccess, () => {
      return true;
    });
    _OnShellOpenError = this.wrap(super._OnShellOpenError, (tag) => this._currentTag === tag);
    _OnAnyShellOpenError = this.wrap(super._OnAnyShellOpenError, () => {
      return true;
    });
    _OnExplorerOpenSuccess = this.wrap(super._OnExplorerOpenSuccess, (tag) => this._currentTag === tag);
    _OnAnyExplorerOpenSuccess = this.wrap(super._OnAnyExplorerOpenSuccess, () => {
      return true;
    });
    _OnExplorerOpenError = this.wrap(super._OnExplorerOpenError, (tag) => this._currentTag === tag);
    _OnAnyExplorerOpenError = this.wrap(super._OnAnyExplorerOpenError, () => {
      return true;
    });
    _OnWriteBinaryFileSuccess = this.wrap(super._OnWriteBinaryFileSuccess, (tag) => this._currentTag === tag);
    _OnAnyWriteBinaryFileSuccess = this.wrap(super._OnAnyWriteBinaryFileSuccess, () => {
      return true;
    });
    _OnWriteBinaryFileError = this.wrap(super._OnWriteBinaryFileError, (tag) => this._currentTag === tag);
    _OnAnyWriteBinaryFileError = this.wrap(super._OnAnyWriteBinaryFileError, () => {
      return true;
    });
    _OnWriteTextFileSuccess = this.wrap(super._OnWriteTextFileSuccess, (tag) => this._currentTag === tag);
    _OnAnyWriteTextFileSuccess = this.wrap(super._OnAnyWriteTextFileSuccess, () => {
      return true;
    });
    _OnWriteTextFileError = this.wrap(super._OnWriteTextFileError, (tag) => this._currentTag === tag);
    _OnAnyWriteTextFileError = this.wrap(super._OnAnyWriteTextFileError, () => {
      return true;
    });
    _OnWriteTextSuccess = this.wrap(super._OnWriteTextSuccess, (tag) => this._currentTag === tag);
    _OnAnyWriteTextSuccess = this.wrap(super._OnAnyWriteTextSuccess, () => {
      return true;
    });
    _OnWriteTextError = this.wrap(super._OnWriteTextError, (tag) => this._currentTag === tag);
    _OnAnyWriteTextError = this.wrap(super._OnAnyWriteTextError, () => {
      return true;
    });
    _OnReadTextFileSuccess = this.wrap(super._OnReadTextFileSuccess, (tag) => this._currentTag === tag);
    _OnAnyReadTextFileSuccess = this.wrap(super._OnAnyReadTextFileSuccess, () => {
      return true;
    });
    _OnReadTextFileError = this.wrap(super._OnReadTextFileError, (tag) => this._currentTag === tag);
    _OnAnyReadTextFileError = this.wrap(super._OnAnyReadTextFileError, () => {
      return true;
    });
    _OnCheckIfPathExistSuccess = this.wrap(super._OnCheckIfPathExistSuccess, (tag) => this._currentTag === tag);
    _OnAnyCheckIfPathExistSuccess = this.wrap(super._OnAnyCheckIfPathExistSuccess, () => {
      return true;
    });
    _OnCheckIfPathExistError = this.wrap(super._OnCheckIfPathExistError, (tag) => this._currentTag === tag);
    _OnAnyCheckIfPathExistError = this.wrap(super._OnAnyCheckIfPathExistError, () => {
      return true;
    });
    _OnShowFolderDialogSuccess = this.wrap(super._OnShowFolderDialogSuccess, (tag) => this._currentTag === tag);
    _OnAnyShowFolderDialogSuccess = this.wrap(super._OnAnyShowFolderDialogSuccess, () => {
      return true;
    });
    _OnShowFolderDialogError = this.wrap(super._OnShowFolderDialogError, (tag) => this._currentTag === tag);
    _OnAnyShowFolderDialogError = this.wrap(super._OnAnyShowFolderDialogError, () => {
      return true;
    });
    _OnShowOpenDialogSuccess = this.wrap(super._OnShowOpenDialogSuccess, (tag) => this._currentTag === tag);
    _OnAnyShowOpenDialogSuccess = this.wrap(super._OnAnyShowOpenDialogSuccess, () => {
      return true;
    });
    _OnShowOpenDialogError = this.wrap(super._OnShowOpenDialogError, (tag) => this._currentTag === tag);
    _OnAnyShowOpenDialogError = this.wrap(super._OnAnyShowOpenDialogError, () => {
      return true;
    });
    _OnShowSaveDialogSuccess = this.wrap(super._OnShowSaveDialogSuccess, (tag) => this._currentTag === tag);
    _OnAnyShowSaveDialogSuccess = this.wrap(super._OnAnyShowSaveDialogSuccess, () => {
      return true;
    });
    _OnShowSaveDialogError = this.wrap(super._OnShowSaveDialogError, (tag) => this._currentTag === tag);
    _OnAnyShowSaveDialogError = this.wrap(super._OnAnyShowSaveDialogError, () => {
      return true;
    });
    _OnMaximizeSuccess = this.wrap(super._OnMaximizeSuccess, (tag) => this._currentTag === tag);
    _OnAnyMaximizeSuccess = this.wrap(super._OnAnyMaximizeSuccess, () => {
      return true;
    });
    _OnMaximizeError = this.wrap(super._OnMaximizeError, (tag) => this._currentTag === tag);
    _OnAnyMaximizeError = this.wrap(super._OnAnyMaximizeError, () => {
      return true;
    });
    _OnMinimizeSuccess = this.wrap(super._OnMinimizeSuccess, (tag) => this._currentTag === tag);
    _OnAnyMinimizeSuccess = this.wrap(super._OnAnyMinimizeSuccess, () => {
      return true;
    });
    _OnMinimizeError = this.wrap(super._OnMinimizeError, (tag) => this._currentTag === tag);
    _OnAnyMinimizeError = this.wrap(super._OnAnyMinimizeError, () => {
      return true;
    });
    _OnRestoreSuccess = this.wrap(super._OnRestoreSuccess, (tag) => this._currentTag === tag);
    _OnAnyRestoreSuccess = this.wrap(super._OnAnyRestoreSuccess, () => {
      return true;
    });
    _OnRestoreError = this.wrap(super._OnRestoreError, (tag) => this._currentTag === tag);
    _OnAnyRestoreError = this.wrap(super._OnAnyRestoreError, () => {
      return true;
    });
    _OnRequestAttentionSuccess = this.wrap(super._OnRequestAttentionSuccess, (tag) => this._currentTag === tag);
    _OnAnyRequestAttentionSuccess = this.wrap(super._OnAnyRequestAttentionSuccess, () => {
      return true;
    });
    _OnRequestAttentionError = this.wrap(super._OnRequestAttentionError, (tag) => this._currentTag === tag);
    _OnAnyRequestAttentionError = this.wrap(super._OnAnyRequestAttentionError, () => {
      return true;
    });
    _OnSetAlwaysOnTopSuccess = this.wrap(super._OnSetAlwaysOnTopSuccess, (tag) => this._currentTag === tag);
    _OnAnySetAlwaysOnTopSuccess = this.wrap(super._OnAnySetAlwaysOnTopSuccess, () => {
      return true;
    });
    _OnSetAlwaysOnTopError = this.wrap(super._OnSetAlwaysOnTopError, (tag) => this._currentTag === tag);
    _OnAnySetAlwaysOnTopError = this.wrap(super._OnAnySetAlwaysOnTopError, () => {
      return true;
    });
    _OnSetHeightSuccess = this.wrap(super._OnSetHeightSuccess, (tag) => this._currentTag === tag);
    _OnAnySetHeightSuccess = this.wrap(super._OnAnySetHeightSuccess, () => {
      return true;
    });
    _OnSetHeightError = this.wrap(super._OnSetHeightError, (tag) => this._currentTag === tag);
    _OnAnySetHeightError = this.wrap(super._OnAnySetHeightError, () => {
      return true;
    });
    _OnSetMaximumSizeSuccess = this.wrap(super._OnSetMaximumSizeSuccess, (tag) => this._currentTag === tag);
    _OnAnySetMaximumSizeSuccess = this.wrap(super._OnAnySetMaximumSizeSuccess, () => {
      return true;
    });
    _OnSetMaximumSizeError = this.wrap(super._OnSetMaximumSizeError, (tag) => this._currentTag === tag);
    _OnAnySetMaximumSizeError = this.wrap(super._OnAnySetMaximumSizeError, () => {
      return true;
    });
    _OnSetMinimumSizeSuccess = this.wrap(super._OnSetMinimumSizeSuccess, (tag) => this._currentTag === tag);
    _OnAnySetMinimumSizeSuccess = this.wrap(super._OnAnySetMinimumSizeSuccess, () => {
      return true;
    });
    _OnSetMinimumSizeError = this.wrap(super._OnSetMinimumSizeError, (tag) => this._currentTag === tag);
    _OnAnySetMinimumSizeError = this.wrap(super._OnAnySetMinimumSizeError, () => {
      return true;
    });
    _OnSetResizableSuccess = this.wrap(super._OnSetResizableSuccess, (tag) => this._currentTag === tag);
    _OnAnySetResizableSuccess = this.wrap(super._OnAnySetResizableSuccess, () => {
      return true;
    });
    _OnSetResizableError = this.wrap(super._OnSetResizableError, (tag) => this._currentTag === tag);
    _OnAnySetResizableError = this.wrap(super._OnAnySetResizableError, () => {
      return true;
    });
    _OnSetTitleSuccess = this.wrap(super._OnSetTitleSuccess, (tag) => this._currentTag === tag);
    _OnAnySetTitleSuccess = this.wrap(super._OnAnySetTitleSuccess, () => {
      return true;
    });
    _OnSetTitleError = this.wrap(super._OnSetTitleError, (tag) => this._currentTag === tag);
    _OnAnySetTitleError = this.wrap(super._OnAnySetTitleError, () => {
      return true;
    });
    _OnSetWidthSuccess = this.wrap(super._OnSetWidthSuccess, (tag) => this._currentTag === tag);
    _OnAnySetWidthSuccess = this.wrap(super._OnAnySetWidthSuccess, () => {
      return true;
    });
    _OnSetWidthError = this.wrap(super._OnSetWidthError, (tag) => this._currentTag === tag);
    _OnAnySetWidthError = this.wrap(super._OnAnySetWidthError, () => {
      return true;
    });
    _OnSetXSuccess = this.wrap(super._OnSetXSuccess, (tag) => this._currentTag === tag);
    _OnAnySetXSuccess = this.wrap(super._OnAnySetXSuccess, () => {
      return true;
    });
    _OnSetXError = this.wrap(super._OnSetXError, (tag) => this._currentTag === tag);
    _OnAnySetXError = this.wrap(super._OnAnySetXError, () => {
      return true;
    });
    _OnSetYSuccess = this.wrap(super._OnSetYSuccess, (tag) => this._currentTag === tag);
    _OnAnySetYSuccess = this.wrap(super._OnAnySetYSuccess, () => {
      return true;
    });
    _OnSetYError = this.wrap(super._OnSetYError, (tag) => this._currentTag === tag);
    _OnAnySetYError = this.wrap(super._OnAnySetYError, () => {
      return true;
    });
    _OnShowDevToolsSuccess = this.wrap(super._OnShowDevToolsSuccess, (tag) => this._currentTag === tag);
    _OnAnyShowDevToolsSuccess = this.wrap(super._OnAnyShowDevToolsSuccess, () => {
      return true;
    });
    _OnShowDevToolsError = this.wrap(super._OnShowDevToolsError, (tag) => this._currentTag === tag);
    _OnAnyShowDevToolsError = this.wrap(super._OnAnyShowDevToolsError, () => {
      return true;
    });
    _OnUnmaximizeSuccess = this.wrap(super._OnUnmaximizeSuccess, (tag) => this._currentTag === tag);
    _OnAnyUnmaximizeSuccess = this.wrap(super._OnAnyUnmaximizeSuccess, () => {
      return true;
    });
    _OnUnmaximizeError = this.wrap(super._OnUnmaximizeError, (tag) => this._currentTag === tag);
    _OnAnyUnmaximizeError = this.wrap(super._OnAnyUnmaximizeError, () => {
      return true;
    });
    _OnSetFullscreenSuccess = this.wrap(super._OnSetFullscreenSuccess, (tag) => this._currentTag === tag);
    _OnAnySetFullscreenSuccess = this.wrap(super._OnAnySetFullscreenSuccess, () => {
      return true;
    });
    _OnSetFullscreenError = this.wrap(super._OnSetFullscreenError, (tag) => this._currentTag === tag);
    _OnAnySetFullscreenError = this.wrap(super._OnAnySetFullscreenError, () => {
      return true;
    });
    _OnActivateAchievementSuccess = this.wrap(super._OnActivateAchievementSuccess, (tag) => this._currentTag === tag);
    _OnAnyActivateAchievementSuccess = this.wrap(super._OnAnyActivateAchievementSuccess, () => true);
    _OnActivateAchievementError = this.wrap(super._OnActivateAchievementError, (tag) => this._currentTag === tag);
    _OnAnyActivateAchievementError = this.wrap(super._OnAnyActivateAchievementError, () => true);
    _OnLeaderboardUploadScoreSuccess = this.wrap(super._OnLeaderboardUploadScoreSuccess, (tag) => this._currentTag === tag);
    _OnAnyLeaderboardUploadScoreSuccess = this.wrap(super._OnAnyLeaderboardUploadScoreSuccess, () => true);
    _OnLeaderboardUploadScoreError = this.wrap(super._OnLeaderboardUploadScoreError, (tag) => this._currentTag === tag);
    _OnAnyLeaderboardUploadScoreError = this.wrap(super._OnAnyLeaderboardUploadScoreError, () => true);
    _OnLeaderboardDownloadScoreSuccess = this.wrap(super._OnLeaderboardDownloadScoreSuccess, (tag) => this._currentTag === tag);
    _OnAnyLeaderboardDownloadScoreSuccess = this.wrap(super._OnAnyLeaderboardDownloadScoreSuccess, () => true);
    _OnLeaderboardDownloadScoreError = this.wrap(super._OnLeaderboardDownloadScoreError, (tag) => this._currentTag === tag);
    _OnAnyLeaderboardDownloadScoreError = this.wrap(super._OnAnyLeaderboardDownloadScoreError, () => true);
    _OnLeaderboardUploadScoreWithMetadataSuccess = this.wrap(super._OnLeaderboardUploadScoreWithMetadataSuccess, (tag) => this._currentTag === tag);
    _OnAnyLeaderboardUploadScoreWithMetadataSuccess = this.wrap(super._OnAnyLeaderboardUploadScoreWithMetadataSuccess, () => true);
    _OnLeaderboardUploadScoreWithMetadataError = this.wrap(super._OnLeaderboardUploadScoreWithMetadataError, (tag) => this._currentTag === tag);
    _OnAnyLeaderboardUploadScoreWithMetadataError = this.wrap(super._OnAnyLeaderboardUploadScoreWithMetadataError, () => true);
    _OnClearAchievementSuccess = this.wrap(super._OnClearAchievementSuccess, (tag) => this._currentTag === tag);
    _OnAnyClearAchievementSuccess = this.wrap(super._OnAnyClearAchievementSuccess, () => {
      return true;
    });
    _OnClearAchievementError = this.wrap(super._OnClearAchievementError, (tag) => this._currentTag === tag);
    _OnAnyClearAchievementError = this.wrap(super._OnAnyClearAchievementError, () => {
      return true;
    });
    _OnCheckAchievementActivationStateSuccess = this.wrap(super._OnCheckAchievementActivationStateSuccess, (tag) => this._currentTag === tag);
    _OnAnyCheckAchievementActivationStateSuccess = this.wrap(super._OnAnyCheckAchievementActivationStateSuccess, () => {
      return true;
    });
    _OnCheckAchievementActivationStateError = this.wrap(super._OnCheckAchievementActivationStateError, (tag) => this._currentTag === tag);
    _OnAnyCheckAchievementActivationStateError = this.wrap(super._OnAnyCheckAchievementActivationStateError, () => {
      return true;
    });
    _OnSetRichPresenceSuccess = this.wrap(super._OnSetRichPresenceSuccess, (tag) => this._currentTag === tag);
    _OnAnySetRichPresenceSuccess = this.wrap(super._OnAnySetRichPresenceSuccess, () => {
      return true;
    });
    _OnSetRichPresenceError = this.wrap(super._OnSetRichPresenceError, (tag) => this._currentTag === tag);
    _OnAnySetRichPresenceError = this.wrap(super._OnAnySetRichPresenceError, () => {
      return true;
    });
    _OnDiscordSetActivitySuccess = this.wrap(super._OnDiscordSetActivitySuccess, (tag) => this._currentTag === tag);
    _OnAnyDiscordSetActivitySuccess = this.wrap(super._OnAnyDiscordSetActivitySuccess, () => {
      return true;
    });
    _OnDiscordSetActivityError = this.wrap(super._OnDiscordSetActivityError, (tag) => this._currentTag === tag);
    _OnAnyDiscordSetActivityError = this.wrap(super._OnAnyDiscordSetActivityError, () => {
      return true;
    });
    _OnActivateToWebPageSuccess = this.wrap(super._OnActivateToWebPageSuccess, (tag) => this._currentTag === tag);
    _OnAnyActivateToWebPageSuccess = this.wrap(super._OnAnyActivateToWebPageSuccess, () => true);
    _OnActivateToWebPageError = this.wrap(super._OnActivateToWebPageError, (tag) => this._currentTag === tag);
    _OnAnyActivateToWebPageError = this.wrap(super._OnAnyActivateToWebPageError, () => true);
    _OnActivateToStoreSuccess = this.wrap(super._OnActivateToStoreSuccess, (tag) => this._currentTag === tag);
    _OnAnyActivateToStoreSuccess = this.wrap(super._OnAnyActivateToStoreSuccess, () => true);
    _OnActivateToStoreError = this.wrap(super._OnActivateToStoreError, (tag) => this._currentTag === tag);
    _OnAnyActivateToStoreError = this.wrap(super._OnAnyActivateToStoreError, () => true);
    _OnGetSteamUILanguageSuccess = this.wrap(super._OnGetSteamUILanguageSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetSteamUILanguageSuccess = this.wrap(super._OnAnyGetSteamUILanguageSuccess, () => true);
    _OnGetSteamUILanguageError = this.wrap(super._OnGetSteamUILanguageError, (tag) => this._currentTag === tag);
    _OnAnyGetSteamUILanguageError = this.wrap(super._OnAnyGetSteamUILanguageError, () => true);
    _OnGetAvailableGameLanguagesSuccess = this.wrap(super._OnGetAvailableGameLanguagesSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetAvailableGameLanguagesSuccess = this.wrap(super._OnAnyGetAvailableGameLanguagesSuccess, () => true);
    _OnGetAvailableGameLanguagesError = this.wrap(super._OnGetAvailableGameLanguagesError, (tag) => this._currentTag === tag);
    _OnAnyGetAvailableGameLanguagesError = this.wrap(super._OnAnyGetAvailableGameLanguagesError, () => true);
    _OnGetCurrentGameLanguageSuccess = this.wrap(super._OnGetCurrentGameLanguageSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetCurrentGameLanguageSuccess = this.wrap(super._OnAnyGetCurrentGameLanguageSuccess, () => true);
    _OnGetCurrentGameLanguageError = this.wrap(super._OnGetCurrentGameLanguageError, (tag) => this._currentTag === tag);
    _OnAnyGetCurrentGameLanguageError = this.wrap(super._OnAnyGetCurrentGameLanguageError, () => true);
    _OnOverlayActivated = this.wrap(super._OnOverlayActivated, () => {
      return true;
    });
    _OnOverlayDeactivated = this.wrap(super._OnOverlayDeactivated, () => {
      return true;
    });
    _OnTriggerScreenshotSuccess = this.wrap(super._OnTriggerScreenshotSuccess, (tag) => this._currentTag === tag);
    _OnAnyTriggerScreenshotSuccess = this.wrap(super._OnAnyTriggerScreenshotSuccess, () => true);
    _OnTriggerScreenshotError = this.wrap(super._OnTriggerScreenshotError, (tag) => this._currentTag === tag);
    _OnAnyTriggerScreenshotError = this.wrap(super._OnAnyTriggerScreenshotError, () => true);
    _OnSaveScreenshotFromURLSuccess = this.wrap(super._OnSaveScreenshotFromURLSuccess, (tag) => this._currentTag === tag);
    _OnAnySaveScreenshotFromURLSuccess = this.wrap(super._OnAnySaveScreenshotFromURLSuccess, () => true);
    _OnSaveScreenshotFromURLError = this.wrap(super._OnSaveScreenshotFromURLError, (tag) => this._currentTag === tag);
    _OnAnySaveScreenshotFromURLError = this.wrap(super._OnAnySaveScreenshotFromURLError, () => true);
    _OnAddScreenshotToLibrarySuccess = this.wrap(super._OnAddScreenshotToLibrarySuccess, (tag) => this._currentTag === tag);
    _OnAnyAddScreenshotToLibrarySuccess = this.wrap(super._OnAnyAddScreenshotToLibrarySuccess, () => true);
    _OnAddScreenshotToLibraryError = this.wrap(super._OnAddScreenshotToLibraryError, (tag) => this._currentTag === tag);
    _OnAnyAddScreenshotToLibraryError = this.wrap(super._OnAnyAddScreenshotToLibraryError, () => true);
    _OnCheckDLCIsInstalledSuccess = this.wrap(super._OnCheckDLCIsInstalledSuccess, (tag) => this._currentTag === tag);
    _OnAnyCheckDLCIsInstalledSuccess = this.wrap(super._OnAnyCheckDLCIsInstalledSuccess, () => true);
    _OnCheckDLCIsInstalledError = this.wrap(super._OnCheckDLCIsInstalledError, (tag) => this._currentTag === tag);
    _OnAnyCheckDLCIsInstalledError = this.wrap(super._OnAnyCheckDLCIsInstalledError, () => true);
    _OnGetFriendsSuccess = this.wrap(super._OnGetFriendsSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetFriendsSuccess = this.wrap(super._OnAnyGetFriendsSuccess, () => true);
    _OnGetFriendsError = this.wrap(super._OnGetFriendsError, (tag) => this._currentTag === tag);
    _OnAnyGetFriendsError = this.wrap(super._OnAnyGetFriendsError, () => true);
    _OnGetFriendNameSuccess = this.wrap(super._OnGetFriendNameSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetFriendNameSuccess = this.wrap(super._OnAnyGetFriendNameSuccess, () => true);
    _OnGetFriendNameError = this.wrap(super._OnGetFriendNameError, (tag) => this._currentTag === tag);
    _OnAnyGetFriendNameError = this.wrap(super._OnAnyGetFriendNameError, () => true);
    _OnShowGamepadTextInputSuccess = this.wrap(super._OnShowGamepadTextInputSuccess, (tag) => this._currentTag === tag);
    _OnAnyShowGamepadTextInputSuccess = this.wrap(super._OnAnyShowGamepadTextInputSuccess, () => true);
    _OnShowGamepadTextInputError = this.wrap(super._OnShowGamepadTextInputError, (tag) => this._currentTag === tag);
    _OnAnyShowGamepadTextInputError = this.wrap(super._OnAnyShowGamepadTextInputError, () => true);
    _OnShowFloatingGamepadTextInputSuccess = this.wrap(super._OnShowFloatingGamepadTextInputSuccess, (tag) => this._currentTag === tag);
    _OnAnyShowFloatingGamepadTextInputSuccess = this.wrap(super._OnAnyShowFloatingGamepadTextInputSuccess, () => true);
    _OnShowFloatingGamepadTextInputError = this.wrap(super._OnShowFloatingGamepadTextInputError, (tag) => this._currentTag === tag);
    _OnAnyShowFloatingGamepadTextInputError = this.wrap(super._OnAnyShowFloatingGamepadTextInputError, () => true);
    _OnCreateWorkshopItemSuccess = this.wrap(super._OnCreateWorkshopItemSuccess, (tag) => this._currentTag === tag);
    _OnAnyCreateWorkshopItemSuccess = this.wrap(super._OnAnyCreateWorkshopItemSuccess, () => true);
    _OnCreateWorkshopItemError = this.wrap(super._OnCreateWorkshopItemError, (tag) => this._currentTag === tag);
    _OnAnyCreateWorkshopItemError = this.wrap(super._OnAnyCreateWorkshopItemError, () => true);
    _OnUpdateWorkshopItemSuccess = this.wrap(super._OnUpdateWorkshopItemSuccess, (tag) => this._currentTag === tag);
    _OnAnyUpdateWorkshopItemSuccess = this.wrap(super._OnAnyUpdateWorkshopItemSuccess, () => true);
    _OnUpdateWorkshopItemError = this.wrap(super._OnUpdateWorkshopItemError, (tag) => this._currentTag === tag);
    _OnAnyUpdateWorkshopItemError = this.wrap(super._OnAnyUpdateWorkshopItemError, () => true);
    _OnGetSubscribedItemsWithMetadataSuccess = this.wrap(super._OnGetSubscribedItemsWithMetadataSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetSubscribedItemsWithMetadataSuccess = this.wrap(super._OnAnyGetSubscribedItemsWithMetadataSuccess, () => true);
    _OnGetSubscribedItemsWithMetadataError = this.wrap(super._OnGetSubscribedItemsWithMetadataError, (tag) => this._currentTag === tag);
    _OnAnyGetSubscribedItemsWithMetadataError = this.wrap(super._OnAnyGetSubscribedItemsWithMetadataError, () => true);
    _OnDownloadWorkshopItemSuccess = this.wrap(super._OnDownloadWorkshopItemSuccess, (tag) => this._currentTag === tag);
    _OnAnyDownloadWorkshopItemSuccess = this.wrap(super._OnAnyDownloadWorkshopItemSuccess, () => true);
    _OnDownloadWorkshopItemError = this.wrap(super._OnDownloadWorkshopItemError, (tag) => this._currentTag === tag);
    _OnAnyDownloadWorkshopItemError = this.wrap(super._OnAnyDownloadWorkshopItemError, () => true);
    _OnDeleteWorkshopItemSuccess = this.wrap(super._OnDeleteWorkshopItemSuccess, (tag) => this._currentTag === tag);
    _OnAnyDeleteWorkshopItemSuccess = this.wrap(super._OnAnyDeleteWorkshopItemSuccess, () => true);
    _OnDeleteWorkshopItemError = this.wrap(super._OnDeleteWorkshopItemError, (tag) => this._currentTag === tag);
    _OnAnyDeleteWorkshopItemError = this.wrap(super._OnAnyDeleteWorkshopItemError, () => true);
    _OnSubscribeWorkshopItemSuccess = this.wrap(super._OnSubscribeWorkshopItemSuccess, (tag) => this._currentTag === tag);
    _OnAnySubscribeWorkshopItemSuccess = this.wrap(super._OnAnySubscribeWorkshopItemSuccess, () => true);
    _OnSubscribeWorkshopItemError = this.wrap(super._OnSubscribeWorkshopItemError, (tag) => this._currentTag === tag);
    _OnAnySubscribeWorkshopItemError = this.wrap(super._OnAnySubscribeWorkshopItemError, () => true);
    _OnUnsubscribeWorkshopItemSuccess = this.wrap(super._OnUnsubscribeWorkshopItemSuccess, (tag) => this._currentTag === tag);
    _OnAnyUnsubscribeWorkshopItemSuccess = this.wrap(super._OnAnyUnsubscribeWorkshopItemSuccess, () => true);
    _OnUnsubscribeWorkshopItemError = this.wrap(super._OnUnsubscribeWorkshopItemError, (tag) => this._currentTag === tag);
    _OnAnyUnsubscribeWorkshopItemError = this.wrap(super._OnAnyUnsubscribeWorkshopItemError, () => true);
    _OnGetWorkshopItemStateSuccess = this.wrap(super._OnGetWorkshopItemStateSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemStateSuccess = this.wrap(super._OnAnyGetWorkshopItemStateSuccess, () => true);
    _OnGetWorkshopItemStateError = this.wrap(super._OnGetWorkshopItemStateError, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemStateError = this.wrap(super._OnAnyGetWorkshopItemStateError, () => true);
    _OnGetWorkshopItemInstallInfoSuccess = this.wrap(super._OnGetWorkshopItemInstallInfoSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemInstallInfoSuccess = this.wrap(super._OnAnyGetWorkshopItemInstallInfoSuccess, () => true);
    _OnGetWorkshopItemInstallInfoError = this.wrap(super._OnGetWorkshopItemInstallInfoError, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemInstallInfoError = this.wrap(super._OnAnyGetWorkshopItemInstallInfoError, () => true);
    _OnGetWorkshopItemDownloadInfoSuccess = this.wrap(super._OnGetWorkshopItemDownloadInfoSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemDownloadInfoSuccess = this.wrap(super._OnAnyGetWorkshopItemDownloadInfoSuccess, () => true);
    _OnGetWorkshopItemDownloadInfoError = this.wrap(super._OnGetWorkshopItemDownloadInfoError, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemDownloadInfoError = this.wrap(super._OnAnyGetWorkshopItemDownloadInfoError, () => true);
    _OnGetWorkshopItemSuccess = this.wrap(super._OnGetWorkshopItemSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemSuccess = this.wrap(super._OnAnyGetWorkshopItemSuccess, () => true);
    _OnGetWorkshopItemError = this.wrap(super._OnGetWorkshopItemError, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemError = this.wrap(super._OnAnyGetWorkshopItemError, () => true);
    _OnGetWorkshopItemsSuccess = this.wrap(super._OnGetWorkshopItemsSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemsSuccess = this.wrap(super._OnAnyGetWorkshopItemsSuccess, () => true);
    _OnGetWorkshopItemsError = this.wrap(super._OnGetWorkshopItemsError, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemsError = this.wrap(super._OnAnyGetWorkshopItemsError, () => true);
    _OnGetSubscribedWorkshopItemsSuccess = this.wrap(super._OnGetSubscribedWorkshopItemsSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetSubscribedWorkshopItemsSuccess = this.wrap(super._OnAnyGetSubscribedWorkshopItemsSuccess, () => true);
    _OnGetSubscribedWorkshopItemsError = this.wrap(super._OnGetSubscribedWorkshopItemsError, (tag) => this._currentTag === tag);
    _OnAnyGetSubscribedWorkshopItemsError = this.wrap(super._OnAnyGetSubscribedWorkshopItemsError, () => true);
    _OnGetWorkshopItemWithMetadataSuccess = this.wrap(super._OnGetWorkshopItemWithMetadataSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemWithMetadataSuccess = this.wrap(super._OnAnyGetWorkshopItemWithMetadataSuccess, () => true);
    _OnGetWorkshopItemWithMetadataError = this.wrap(super._OnGetWorkshopItemWithMetadataError, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemWithMetadataError = this.wrap(super._OnAnyGetWorkshopItemWithMetadataError, () => true);
    _OnGetWorkshopItemsWithMetadataSuccess = this.wrap(super._OnGetWorkshopItemsWithMetadataSuccess, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemsWithMetadataSuccess = this.wrap(super._OnAnyGetWorkshopItemsWithMetadataSuccess, () => true);
    _OnGetWorkshopItemsWithMetadataError = this.wrap(super._OnGetWorkshopItemsWithMetadataError, (tag) => this._currentTag === tag);
    _OnAnyGetWorkshopItemsWithMetadataError = this.wrap(super._OnAnyGetWorkshopItemsWithMetadataError, () => true);
    _IsFullScreen = this.wrap(super._IsFullScreen, (state) => {
      return this._fullscreenState === state;
    }, () => false);
    _LastCheckedPathExists = this.wrap(super._LastCheckedPathExists, (state) => {
      return this._CheckIfPathExistErrorValue === "";
    }, () => false);
    _IsInitialized = this.wrap(super._IsInitialized, () => {
      return this._isInitialized;
    }, () => false);
    // #endregion
    // #region Exps
    _UserFolder = this.exprs(super._UserFolder, () => {
      return this._userFolder ?? "";
    });
    _HomeFolder = this.exprs(super._HomeFolder, () => {
      return this._homeFolder ?? "";
    });
    _AppDataFolder = this.exprs(super._AppDataFolder, () => {
      return this._appDataFolder ?? "";
    });
    _UserDataFolder = this.exprs(super._UserDataFolder, () => {
      return this._userDataFolder ?? "";
    });
    _LocalAppDataFolder = this.exprs(super._LocalAppDataFolder, () => {
      return this._localAppDataFolder ?? "";
    });
    _LocalUserDataFolder = this.exprs(super._LocalUserDataFolder, () => {
      return this._localUserDataFolder ?? "";
    });
    _SessionDataFolder = this.exprs(super._SessionDataFolder, () => {
      return this._sessionDataFolder ?? "";
    });
    _TempFolder = this.exprs(super._TempFolder, () => {
      return this._tempFolder ?? "";
    });
    _ExeFolder = this.exprs(super._ExeFolder, () => {
      return this._exeFolder ?? "";
    });
    _ModuleFolder = this.exprs(super._ModuleFolder, () => {
      return this._moduleFolder ?? "";
    });
    _DesktopFolder = this.exprs(super._DesktopFolder, () => {
      return this._desktopFolder ?? "";
    });
    _DocumentsFolder = this.exprs(super._DocumentsFolder, () => {
      return this._documentsFolder ?? "";
    });
    _DownloadsFolder = this.exprs(super._DownloadsFolder, () => {
      return this._downloadsFolder ?? "";
    });
    _MusicFolder = this.exprs(super._MusicFolder, () => {
      return this._musicFolder ?? "";
    });
    _PicturesFolder = this.exprs(super._PicturesFolder, () => {
      return this._picturesFolder ?? "";
    });
    _VideosFolder = this.exprs(super._VideosFolder, () => {
      return this._videosFolder ?? "";
    });
    _RecentFolder = this.exprs(super._RecentFolder, () => {
      return this._recentFolder ?? "";
    });
    _LogsFolder = this.exprs(super._LogsFolder, () => {
      return this._logsFolder ?? "";
    });
    _CrashDumpsFolder = this.exprs(super._CrashDumpsFolder, () => {
      return this._crashDumpsFolder ?? "";
    });
    _AppFolder = this.exprs(super._AppFolder, () => {
      return this._appFolder ?? "";
    });
    _AppFolderURL = this.exprs(super._AppFolderURL, () => {
      return "deprecrated";
    });
    _ArgumentAt = this.exprs(super._ArgumentAt, () => {
      console.error('"_ArgumentAt" Not implemented');
      return "";
    });
    _ArgumentCount = this.exprs(super._ArgumentCount, () => {
      console.error('"_ArgumentCount" Not implemented');
      return -1;
    });
    _DroppedFile = this.exprs(super._DroppedFile, () => {
      console.error('"_DroppedFile" Not implemented');
      return "";
    });
    _ListAt = this.exprs(super._ListAt, (index) => {
      return this._ListFilesResultValue[index]?.path ?? "";
    });
    _ListCount = this.exprs(super._ListCount, () => {
      return this._ListFilesResultValue.length;
    });
    _ProjectFilesFolder = this.exprs(super._ProjectFilesFolder, () => {
      return this._projectFilesFolder ?? "";
    });
    _ProjectFilesFolderURL = this.exprs(super._ProjectFilesFolderURL, () => {
      return this._projectFilesFolder ?? "";
    });
    _ReadFile = this.exprs(super._ReadFile, () => {
      return this._ReadTextFileResultValue ?? "";
    });
    _WindowHeight = this.exprs(super._WindowHeight, () => {
      return this._windowHeight;
    });
    _WindowWidth = this.exprs(super._WindowWidth, () => {
      return this._windowWidth;
    });
    _WindowTitle = this.exprs(super._WindowTitle, () => {
      return this._windowTitle;
    });
    _WindowX = this.exprs(super._WindowX, () => {
      return this._windowX;
    });
    _WindowY = this.exprs(super._WindowY, () => {
      return this._windowY;
    });
    _IsEngine = this.exprs(super._IsEngine, (engine) => {
      const _engine = this.pipelabInfos?.engine ?? "";
      if (engine === 0) return _engine === "electron";
      if (engine === 1) return _engine === "tauri";
      return false;
    });
    _IsPipelab = this.exprs(super._IsPipelab, () => {
      return this.pipelabInfos?.isPipelab ?? false;
    });
    _LastPathExists = this.exprs(super._LastPathExists, () => {
      return this._lastPathExists;
    });
    _FullscreenState = () => {
      return this._fullscreenState;
    };
    _CurrentPlatform = this.exprs(super._CurrentPlatform, () => {
      return this._platform;
    });
    _CurrentArchitecture = this.exprs(super._CurrentArchitecture, () => {
      return this._arch;
    });
    _SteamAccountId = this.exprs(super._SteamAccountId, () => {
      return this._steam_SteamId.accountId;
    });
    _SteamId32 = this.exprs(super._SteamId32, () => {
      return this._steam_SteamId.steamId32;
    });
    _SteamId64 = this.exprs(super._SteamId64, () => {
      return this._steam_SteamId.steamId64;
    });
    _SteamUsername = this.exprs(super._SteamUsername, () => {
      return this._steam_Name;
    });
    _SteamLevel = this.exprs(super._SteamLevel, () => {
      return this._steam_Level;
    });
    _SteamIpCountry = this.exprs(super._SteamIpCountry, () => {
      return this._steam_IpCountry;
    });
    _SteamIsRunningOnSteamDeck = this.exprs(super._SteamIsRunningOnSteamDeck, () => {
      return this._steam_IsRunningOnSteamDeck ? 1 : 0;
    });
    _SteamAppId = this.exprs(super._SteamAppId, () => {
      return this._steam_AppId;
    });
    _SteamIsOffline = this.exprs(super._SteamIsOffline, (state) => {
      return state === 0 ? 1 : 0;
    });
    _SteamIsOnline = this.exprs(super._SteamIsOnline, (state) => {
      return state === 1 ? 1 : 0;
    });
    _SteamIsBusy = this.exprs(super._SteamIsBusy, (state) => {
      return state === 2 ? 1 : 0;
    });
    _SteamIsAway = this.exprs(super._SteamIsAway, (state) => {
      return state === 3 ? 1 : 0;
    });
    _SteamIsSnooze = this.exprs(super._SteamIsSnooze, (state) => {
      return state === 4 ? 1 : 0;
    });
    _SteamIsLookingToTrade = this.exprs(super._SteamIsLookingToTrade, (state) => {
      return state === 5 ? 1 : 0;
    });
    _SteamIsLookingToPlay = this.exprs(super._SteamIsLookingToPlay, (state) => {
      return state === 6 ? 1 : 0;
    });
    _SteamIsInvisible = this.exprs(super._SteamIsInvisible, (state) => {
      return state === 7 ? 1 : 0;
    });
    _IsOverlayActive = this.wrap(super._IsOverlayActive, () => {
      return this._lastOverlayState ? 1 : 0;
    });
    _InitializeError = this.exprs(super._InitializeError, () => {
      return this._InitializeErrorValue;
    });
    _InitializeResult = this.exprs(super._InitializeResult, () => {
      return this._InitializeResultValue;
    });
    _AppendFileError = this.exprs(super._AppendFileError, () => {
      return this._AppendFileErrorValue;
    });
    _AppendFileResult = this.exprs(super._AppendFileResult, () => {
      return this._AppendFileResultValue;
    });
    _CopyFileError = this.exprs(super._CopyFileError, () => {
      return this._CopyFileErrorValue;
    });
    _CopyFileResult = this.exprs(super._CopyFileResult, () => {
      return this._CopyFileResultValue;
    });
    _FetchFileSizeError = this.exprs(super._FetchFileSizeError, () => {
      return this._FetchFileSizeErrorValue;
    });
    _FetchFileSizeResult = this.exprs(super._FetchFileSizeResult, () => {
      return this._FetchFileSizeResultValue;
    });
    _CreateFolderError = this.exprs(super._CreateFolderError, () => {
      return this._CreateFolderErrorValue;
    });
    _CreateFolderResult = this.exprs(super._CreateFolderResult, () => {
      return this._CreateFolderResultValue;
    });
    _DeleteFileError = this.exprs(super._DeleteFileError, () => {
      return this._DeleteFileErrorValue;
    });
    _DeleteFileResult = this.exprs(super._DeleteFileResult, () => {
      return this._DeleteFileResultValue;
    });
    _ListFilesError = this.exprs(super._ListFilesError, () => {
      return this._ListFilesErrorValue;
    });
    _ListFilesResult = this.exprs(super._ListFilesResult, () => {
      return this._ListFilesResultValue;
    });
    _MoveFileError = this.exprs(super._MoveFileError, () => {
      return this._MoveFileErrorValue;
    });
    _MoveFileResult = this.exprs(super._MoveFileResult, () => {
      return this._MoveFileResultValue;
    });
    _OpenBrowserError = this.exprs(super._OpenBrowserError, () => {
      return this._OpenBrowserErrorValue;
    });
    _OpenBrowserResult = this.exprs(super._OpenBrowserResult, () => {
      return this._OpenBrowserResultValue;
    });
    _ReadBinaryFileError = this.exprs(super._ReadBinaryFileError, () => {
      return this._ReadBinaryFileErrorValue;
    });
    _ReadBinaryFileResult = this.exprs(super._ReadBinaryFileResult, () => {
      return this._ReadBinaryFileResultValue;
    });
    _RenameFileError = this.exprs(super._RenameFileError, () => {
      return this._RenameFileErrorValue;
    });
    _RenameFileResult = this.exprs(super._RenameFileResult, () => {
      return this._RenameFileResultValue;
    });
    _RunFileError = this.exprs(super._RunFileError, () => {
      return this._RunFileErrorValue;
    });
    _RunFileResult = this.exprs(super._RunFileResult, () => {
      return this._RunFileResultValue;
    });
    _ShellOpenError = this.exprs(super._ShellOpenError, () => {
      return this._ShellOpenErrorValue;
    });
    _ShellOpenResult = this.exprs(super._ShellOpenResult, () => {
      return this._ShellOpenResultValue;
    });
    _ExplorerOpenError = this.exprs(super._ExplorerOpenError, () => {
      return this._ExplorerOpenErrorValue;
    });
    _ExplorerOpenResult = this.exprs(super._ExplorerOpenResult, () => {
      return this._ExplorerOpenResultValue;
    });
    _WriteBinaryFileError = this.exprs(super._WriteBinaryFileError, () => {
      return this._WriteBinaryFileErrorValue;
    });
    _WriteBinaryFileResult = this.exprs(super._WriteBinaryFileResult, () => {
      return this._WriteBinaryFileResultValue;
    });
    _WriteTextFileError = this.exprs(super._WriteTextFileError, () => {
      return this._WriteTextFileErrorValue;
    });
    _WriteTextFileResult = this.exprs(super._WriteTextFileResult, () => {
      return this._WriteTextFileResultValue;
    });
    _WriteTextError = this.exprs(super._WriteTextError, () => {
      return this._WriteTextErrorValue;
    });
    _WriteTextResult = this.exprs(super._WriteTextResult, () => {
      return this._WriteTextResultValue;
    });
    _ReadTextFileError = this.exprs(super._ReadTextFileError, () => {
      return this._ReadTextFileErrorValue;
    });
    _ReadTextFileResult = this.exprs(super._ReadTextFileResult, () => {
      return this._ReadTextFileResultValue;
    });
    _CheckIfPathExistError = this.exprs(super._CheckIfPathExistError, () => {
      return this._CheckIfPathExistErrorValue;
    });
    _CheckIfPathExistResult = this.exprs(super._CheckIfPathExistResult, () => {
      return this._CheckIfPathExistResultValue;
    });
    _ShowFolderDialogError = this.exprs(super._ShowFolderDialogError, () => {
      return this._ShowFolderDialogErrorValue;
    });
    _ShowFolderDialogResult = this.exprs(super._ShowFolderDialogResult, () => {
      return this._ShowFolderDialogResultValue;
    });
    _ShowOpenDialogError = this.exprs(super._ShowOpenDialogError, () => {
      return this._ShowOpenDialogErrorValue;
    });
    _ShowOpenDialogResult = this.exprs(super._ShowOpenDialogResult, () => {
      return this._ShowOpenDialogResultValue;
    });
    _ShowSaveDialogError = this.exprs(super._ShowSaveDialogError, () => {
      return this._ShowSaveDialogErrorValue;
    });
    _ShowSaveDialogResult = this.exprs(super._ShowSaveDialogResult, () => {
      return this._ShowSaveDialogResultValue;
    });
    _MaximizeError = this.exprs(super._MaximizeError, () => {
      return this._MaximizeErrorValue;
    });
    _MaximizeResult = this.exprs(super._MaximizeResult, () => {
      return this._MaximizeResultValue;
    });
    _MinimizeError = this.exprs(super._MinimizeError, () => {
      return this._MinimizeErrorValue;
    });
    _MinimizeResult = this.exprs(super._MinimizeResult, () => {
      return this._MinimizeResultValue;
    });
    _RestoreError = this.exprs(super._RestoreError, () => {
      return this._RestoreErrorValue;
    });
    _RestoreResult = this.exprs(super._RestoreResult, () => {
      return this._RestoreResultValue;
    });
    _RequestAttentionError = this.exprs(super._RequestAttentionError, () => {
      return this._RequestAttentionErrorValue;
    });
    _RequestAttentionResult = this.exprs(super._RequestAttentionResult, () => {
      return this._RequestAttentionResultValue;
    });
    _SetAlwaysOnTopError = this.exprs(super._SetAlwaysOnTopError, () => {
      return this._SetAlwaysOnTopErrorValue;
    });
    _SetAlwaysOnTopResult = this.exprs(super._SetAlwaysOnTopResult, () => {
      return this._SetAlwaysOnTopResultValue;
    });
    _SetHeightError = this.exprs(super._SetHeightError, () => {
      return this._SetHeightErrorValue;
    });
    _SetHeightResult = this.exprs(super._SetHeightResult, () => {
      return this._SetHeightResultValue;
    });
    _SetMaximumSizeError = this.exprs(super._SetMaximumSizeError, () => {
      return this._SetMaximumSizeErrorValue;
    });
    _SetMaximumSizeResult = this.exprs(super._SetMaximumSizeResult, () => {
      return this._SetMaximumSizeResultValue;
    });
    _SetMinimumSizeError = this.exprs(super._SetMinimumSizeError, () => {
      return this._SetMinimumSizeErrorValue;
    });
    _SetMinimumSizeResult = this.exprs(super._SetMinimumSizeResult, () => {
      return this._SetMinimumSizeResultValue;
    });
    _SetResizableError = this.exprs(super._SetResizableError, () => {
      return this._SetResizableErrorValue;
    });
    _SetResizableResult = this.exprs(super._SetResizableResult, () => {
      return this._SetResizableResultValue;
    });
    _SetTitleError = this.exprs(super._SetTitleError, () => {
      return this._SetTitleErrorValue;
    });
    _SetTitleResult = this.exprs(super._SetTitleResult, () => {
      return this._SetTitleResultValue;
    });
    _SetWidthError = this.exprs(super._SetWidthError, () => {
      return this._SetWidthErrorValue;
    });
    _SetWidthResult = this.exprs(super._SetWidthResult, () => {
      return this._SetWidthResultValue;
    });
    _SetXError = this.exprs(super._SetXError, () => {
      return this._SetXErrorValue;
    });
    _SetXResult = this.exprs(super._SetXResult, () => {
      return this._SetXResultValue;
    });
    _SetYError = this.exprs(super._SetYError, () => {
      return this._SetYErrorValue;
    });
    _SetYResult = this.exprs(super._SetYResult, () => {
      return this._SetYResultValue;
    });
    _ShowDevToolsError = this.exprs(super._ShowDevToolsError, () => {
      return this._ShowDevToolsErrorValue;
    });
    _ShowDevToolsResult = this.exprs(super._ShowDevToolsResult, () => {
      return this._ShowDevToolsResultValue;
    });
    _UnmaximizeError = this.exprs(super._UnmaximizeError, () => {
      return this._UnmaximizeErrorValue;
    });
    _UnmaximizeResult = this.exprs(super._UnmaximizeResult, () => {
      return this._UnmaximizeResultValue;
    });
    _SetFullscreenError = this.exprs(super._SetFullscreenError, () => {
      return this._SetFullscreenErrorValue;
    });
    _SetFullscreenResult = this.exprs(super._SetFullscreenResult, () => {
      return this._SetFullscreenResultValue;
    });
    _ActivateAchievementError = this.exprs(super._ActivateAchievementError, () => {
      return this._ActivateAchievementErrorValue;
    });
    _ActivateAchievementResult = this.exprs(super._ActivateAchievementResult, () => {
      return this._ActivateAchievementResultValue;
    });
    _ClearAchievementError = this.exprs(super._ClearAchievementError, () => {
      return this._ClearAchievementErrorValue;
    });
    _ClearAchievementResult = this.exprs(super._ClearAchievementResult, () => {
      return this._ClearAchievementResultValue;
    });
    _CheckAchievementActivationStateError = this.exprs(super._CheckAchievementActivationStateError, () => {
      return this._CheckAchievementActivationStateErrorValue;
    });
    _CheckAchievementActivationStateResult = this.exprs(super._CheckAchievementActivationStateResult, () => {
      return this._CheckAchievementActivationStateResultValue;
    });
    _SetRichPresenceError = this.exprs(super._SetRichPresenceError, () => {
      return this._SetRichPresenceErrorValue;
    });
    _SetRichPresenceResult = this.exprs(super._SetRichPresenceResult, () => {
      return this._SetRichPresenceResultValue;
    });
    _LeaderboardUploadScoreError = this.exprs(super._LeaderboardUploadScoreError, () => {
      return this._LeaderboardUploadScoreErrorValue;
    });
    _LeaderboardUploadScoreResult = this.exprs(super._LeaderboardUploadScoreResult, () => {
      return this._LeaderboardUploadScoreResultValue;
    });
    _LeaderboardUploadScoreWithMetadataError = this.exprs(super._LeaderboardUploadScoreWithMetadataError, () => {
      return this._LeaderboardUploadScoreWithMetadataErrorValue;
    });
    _LeaderboardUploadScoreWithMetadataResult = this.exprs(super._LeaderboardUploadScoreWithMetadataResult, () => {
      return this._LeaderboardUploadScoreWithMetadataResultValue;
    });
    _LeaderboardDownloadScoreError = this.exprs(super._LeaderboardDownloadScoreError, () => {
      return this._LeaderboardDownloadScoreErrorValue;
    });
    _LeaderboardDownloadScoreResult = this.exprs(super._LeaderboardDownloadScoreResult, () => {
      return this._LeaderboardDownloadScoreResultValue;
    });
    _DiscordSetActivityError = this.exprs(super._DiscordSetActivityError, () => {
      return this._DiscordSetActivityErrorValue;
    });
    _DiscordSetActivityResult = this.exprs(super._DiscordSetActivityResult, () => {
      return this._DiscordSetActivityResultValue;
    });
    _ActivateToWebPageError = this.exprs(super._ActivateToWebPageError, () => {
      return this._ActivateToWebPageErrorValue;
    });
    _ActivateToWebPageResult = this.exprs(super._ActivateToWebPageResult, () => {
      return this._ActivateToWebPageResultValue;
    });
    _ActivateToStoreError = this.exprs(super._ActivateToStoreError, () => {
      return this._ActivateToStoreErrorValue;
    });
    _ActivateToStoreResult = this.exprs(super._ActivateToStoreResult, () => {
      return this._ActivateToStoreResultValue;
    });
    _GetSteamUILanguageError = this.exprs(super._GetSteamUILanguageError, () => {
      return this._GetSteamUILanguageErrorValue;
    });
    _GetSteamUILanguageResult = this.exprs(super._GetSteamUILanguageResult, () => {
      return this._GetSteamUILanguageResultValue;
    });
    _GetAvailableGameLanguagesError = this.exprs(super._GetAvailableGameLanguagesError, () => {
      return this._GetAvailableGameLanguagesErrorValue;
    });
    _GetAvailableGameLanguagesResult = this.exprs(super._GetAvailableGameLanguagesResult, () => {
      return this._GetAvailableGameLanguagesResultValue;
    });
    _GetCurrentGameLanguageError = this.exprs(super._GetCurrentGameLanguageError, () => {
      return this._GetCurrentGameLanguageErrorValue;
    });
    _GetCurrentGameLanguageResult = this.exprs(super._GetCurrentGameLanguageResult, () => {
      return this._GetCurrentGameLanguageResultValue;
    });
    _TriggerScreenshotError = this.exprs(super._TriggerScreenshotError, () => {
      return this._TriggerScreenshotErrorValue;
    });
    _TriggerScreenshotResult = this.exprs(super._TriggerScreenshotResult, () => {
      return this._TriggerScreenshotResultValue;
    });
    _SaveScreenshotFromURLError = this.exprs(super._SaveScreenshotFromURLError, () => {
      return this._SaveScreenshotFromURLErrorValue;
    });
    _SaveScreenshotFromURLResult = this.exprs(super._SaveScreenshotFromURLResult, () => {
      return this._SaveScreenshotFromURLResultValue;
    });
    _AddScreenshotToLibraryError = this.exprs(super._AddScreenshotToLibraryError, () => {
      return this._AddScreenshotToLibraryErrorValue;
    });
    _AddScreenshotToLibraryResult = this.exprs(super._AddScreenshotToLibraryResult, () => {
      return this._AddScreenshotToLibraryResultValue;
    });
    _CheckDLCIsInstalledError = this.exprs(super._CheckDLCIsInstalledError, () => {
      return this._CheckDLCIsInstalledErrorValue;
    });
    _CheckDLCIsInstalledResult = this.exprs(super._CheckDLCIsInstalledResult, () => {
      return this._CheckDLCIsInstalledResultValue ?? 0;
    });
    _GetFriendsError = this.exprs(super._GetFriendsError, () => {
      return this._GetFriendsErrorValue;
    });
    _GetFriendsResult = this.exprs(super._GetFriendsResult, () => {
      return this._GetFriendsResultValue;
    });
    _GetFriendNameError = this.exprs(super._GetFriendNameError, () => {
      return this._GetFriendNameErrorValue;
    });
    _GetFriendNameResult = this.exprs(super._GetFriendNameResult, () => {
      return this._GetFriendNameResultValue;
    });
    _ShowGamepadTextInputError = this.exprs(super._ShowGamepadTextInputError, () => {
      return this._ShowGamepadTextInputErrorValue;
    });
    _ShowGamepadTextInputResult = this.exprs(super._ShowGamepadTextInputResult, () => {
      return this._ShowGamepadTextInputResultValue ?? "";
    });
    _ShowFloatingGamepadTextInputError = this.exprs(super._ShowFloatingGamepadTextInputError, () => {
      return this._ShowFloatingGamepadTextInputErrorValue;
    });
    _ShowFloatingGamepadTextInputResult = this.exprs(super._ShowFloatingGamepadTextInputResult, () => {
      return this._ShowFloatingGamepadTextInputResultValue ?? 0;
    });
    // Workshop expressions
    _CreateWorkshopItemError = this.exprs(super._CreateWorkshopItemError, () => {
      return this._CreateWorkshopItemErrorValue;
    });
    _CreateWorkshopItemResult = this.exprs(super._CreateWorkshopItemResult, () => {
      return this._CreateWorkshopItemResultValue;
    });
    _CreateWorkshopItemNeedsAgreement = this.exprs(super._CreateWorkshopItemNeedsAgreement, () => {
      return this._CreateWorkshopItemNeedsAgreementValue;
    });
    _UpdateWorkshopItemError = this.exprs(super._UpdateWorkshopItemError, () => {
      return this._UpdateWorkshopItemErrorValue;
    });
    _UpdateWorkshopItemResult = this.exprs(super._UpdateWorkshopItemResult, () => {
      return this._UpdateWorkshopItemResultValue;
    });
    _UpdateWorkshopItemNeedsAgreement = this.exprs(super._UpdateWorkshopItemNeedsAgreement, () => {
      return this._UpdateWorkshopItemNeedsAgreementValue;
    });
    _GetSubscribedItemsWithMetadataError = this.exprs(super._GetSubscribedItemsWithMetadataError, () => {
      return this._GetSubscribedItemsWithMetadataErrorValue;
    });
    _GetSubscribedItemsWithMetadataResult = this.exprs(super._GetSubscribedItemsWithMetadataResult, () => {
      return this._GetSubscribedItemsWithMetadataErrorValue === "" ? 1 : 0;
    });
    _DownloadWorkshopItemError = this.exprs(super._DownloadWorkshopItemError, () => {
      return this._DownloadWorkshopItemErrorValue;
    });
    _DownloadWorkshopItemResult = this.exprs(super._DownloadWorkshopItemResult, () => {
      return this._DownloadWorkshopItemResultValue;
    });
    _DeleteWorkshopItemError = this.exprs(super._DeleteWorkshopItemError, () => {
      return this._DeleteWorkshopItemErrorValue;
    });
    _DeleteWorkshopItemResult = this.exprs(super._DeleteWorkshopItemResult, () => {
      return this._DeleteWorkshopItemResultValue;
    });
    _SubscribeWorkshopItemError = this.exprs(super._SubscribeWorkshopItemError, () => {
      return this._SubscribeWorkshopItemErrorValue;
    });
    _SubscribeWorkshopItemResult = this.exprs(super._SubscribeWorkshopItemResult, () => {
      return this._SubscribeWorkshopItemResultValue;
    });
    _UnsubscribeWorkshopItemError = this.exprs(super._UnsubscribeWorkshopItemError, () => {
      return this._UnsubscribeWorkshopItemErrorValue;
    });
    _UnsubscribeWorkshopItemResult = this.exprs(super._UnsubscribeWorkshopItemResult, () => {
      return this._UnsubscribeWorkshopItemResultValue;
    });
    _GetWorkshopItemStateError = this.exprs(super._GetWorkshopItemStateError, () => {
      return this._GetWorkshopItemStateErrorValue;
    });
    _GetWorkshopItemStateResult = this.exprs(super._GetWorkshopItemStateResult, () => {
      return this._GetWorkshopItemStateResultValue;
    });
    _GetWorkshopItemInstallInfoError = this.exprs(super._GetWorkshopItemInstallInfoError, () => {
      return this._GetWorkshopItemInstallInfoErrorValue;
    });
    _GetWorkshopItemInstallInfoResult = this.exprs(super._GetWorkshopItemInstallInfoResult, () => {
      return JSON.stringify(this._lastInstallInfo ?? {});
    });
    _GetWorkshopItemDownloadInfoError = this.exprs(super._GetWorkshopItemDownloadInfoError, () => {
      return this._GetWorkshopItemDownloadInfoErrorValue;
    });
    _GetWorkshopItemDownloadInfoResult = this.exprs(super._GetWorkshopItemDownloadInfoResult, () => {
      return JSON.stringify(this._lastDownloadInfo ?? {});
    });
    _GetWorkshopItemError = this.exprs(super._GetWorkshopItemError, () => {
      return this._GetWorkshopItemErrorValue;
    });
    _GetWorkshopItemResult = this.exprs(super._GetWorkshopItemResult, () => {
      return this._GetWorkshopItemErrorValue === "" ? 1 : 0;
    });
    _GetWorkshopItemsError = this.exprs(super._GetWorkshopItemsError, () => {
      return this._GetWorkshopItemsErrorValue;
    });
    _GetWorkshopItemsResult = this.exprs(super._GetWorkshopItemsResult, () => {
      return this._GetWorkshopItemsErrorValue === "" ? 1 : 0;
    });
    _GetSubscribedWorkshopItemsError = this.exprs(super._GetSubscribedWorkshopItemsError, () => {
      return this._GetSubscribedWorkshopItemsErrorValue;
    });
    _GetSubscribedWorkshopItemsResult = this.exprs(super._GetSubscribedWorkshopItemsResult, () => {
      return this._GetSubscribedWorkshopItemsErrorValue === "" ? 1 : 0;
    });
    _GetWorkshopItemWithMetadataError = this.exprs(super._GetWorkshopItemWithMetadataError, () => {
      return this._GetWorkshopItemWithMetadataErrorValue;
    });
    _GetWorkshopItemWithMetadataResult = this.exprs(super._GetWorkshopItemWithMetadataResult, () => {
      return this._GetWorkshopItemWithMetadataErrorValue === "" ? 1 : 0;
    });
    _GetWorkshopItemsWithMetadataError = this.exprs(super._GetWorkshopItemsWithMetadataError, () => {
      return this._GetWorkshopItemsWithMetadataErrorValue;
    });
    _GetWorkshopItemsWithMetadataResult = this.exprs(super._GetWorkshopItemsWithMetadataResult, () => {
      return this._GetWorkshopItemsWithMetadataErrorValue === "" ? 1 : 0;
    });
    _SubscribedItemsCount = this.exprs(super._SubscribedItemsCount, () => {
      return this._subscribedItemIds.length;
    });
    _SubscribedItemIdAt = this.exprs(super._SubscribedItemIdAt, (index) => {
      if (index < 0 || index >= this._subscribedItemIds.length) return "";
      return this._subscribedItemIds[index];
    });
    _WorkshopItemTitle = this.exprs(super._WorkshopItemTitle, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.title ?? "";
    });
    _WorkshopItemDescription = this.exprs(super._WorkshopItemDescription, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.description ?? "";
    });
    _WorkshopItemOwnerSteamId64 = this.exprs(super._WorkshopItemOwnerSteamId64, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.owner?.steamId64?.toString() ?? "";
    });
    _WorkshopItemOwnerAccountId = this.exprs(super._WorkshopItemOwnerAccountId, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.owner?.accountId ?? 0;
    });
    _WorkshopItemTags = this.exprs(super._WorkshopItemTags, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.tags?.join(", ") ?? "";
    });
    _WorkshopItemUpvotes = this.exprs(super._WorkshopItemUpvotes, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.numUpvotes ?? 0;
    });
    _WorkshopItemDownvotes = this.exprs(super._WorkshopItemDownvotes, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.numDownvotes ?? 0;
    });
    _WorkshopItemPreviewUrl = this.exprs(super._WorkshopItemPreviewUrl, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.previewUrl ?? "";
    });
    _WorkshopItemUrl = this.exprs(super._WorkshopItemUrl, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.url ?? "";
    });
    _WorkshopItemTimeCreated = this.exprs(super._WorkshopItemTimeCreated, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.timeCreated ?? 0;
    });
    _WorkshopItemTimeUpdated = this.exprs(super._WorkshopItemTimeUpdated, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.timeUpdated ?? 0;
    });
    _WorkshopItemState = this.exprs(super._WorkshopItemState, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.state ?? 0;
    });
    _WorkshopItemIsInstalled = this.exprs(super._WorkshopItemIsInstalled, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      const state = item?.state;
      return state !== void 0 && state !== null && state & 4 ? 1 : 0;
    });
    _WorkshopItemIsDownloading = this.exprs(super._WorkshopItemIsDownloading, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      const state = item?.state;
      return state !== void 0 && state !== null && state & 16 ? 1 : 0;
    });
    _WorkshopItemNeedsUpdate = this.exprs(super._WorkshopItemNeedsUpdate, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      const state = item?.state;
      return state !== void 0 && state !== null && state & 8 ? 1 : 0;
    });
    _WorkshopItemInstallFolder = this.exprs(super._WorkshopItemInstallFolder, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.installInfo?.folder ?? "";
    });
    _WorkshopItemSizeOnDisk = this.exprs(super._WorkshopItemSizeOnDisk, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return Number(item?.installInfo?.sizeOnDisk ?? 0);
    });
    _WorkshopItemTimestamp = this.exprs(super._WorkshopItemTimestamp, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return item?.installInfo?.timestamp ?? 0;
    });
    _WorkshopItemDownloadCurrent = this.exprs(super._WorkshopItemDownloadCurrent, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return Number(item?.downloadInfo?.current ?? 0);
    });
    _WorkshopItemDownloadTotal = this.exprs(super._WorkshopItemDownloadTotal, (itemId) => {
      const item = this._workshopItemsMap.get(itemId);
      return Number(item?.downloadInfo?.total ?? 0);
    });
    //
    _saveToJson() {
      return {
        // data to be saved for savegames
      };
    }
    _loadFromJson() {
    }
  };
}
P_C.Instance = class extends parentClass[PLUGIN_INFO.type].instance {
  constructor(opts) {
    if (PLUGIN_INFO.hasWrapperExtension) {
      opts.wrapperComponentId = PLUGIN_INFO.id;
      this._isWrapperExtensionAvailable = this.IsWrapperExtensionAvailable();
    }
    if (PLUGIN_INFO.hasDomSide) {
      super(opts, PLUGIN_INFO.id);
    } else {
      super(opts);
    }
  }
  _release() {
    super._release();
  }
};
P_C.Instance = getInstanceJs(P_C.Instance, addonTriggers, C3);
