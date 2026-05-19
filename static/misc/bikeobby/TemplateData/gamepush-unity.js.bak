(() => {
    "use strict";
    class e {
        constructor(e) {
            this.gp = e, this.gp.player.on("change", (() => this.trigger("CallPlayerChange"))), this.gp.player.on("sync", (e => {
                this.trigger(e ? "CallPlayerSyncComplete" : "CallPlayerSyncError")
            })), this.gp.player.on("load", (e => {
                this.trigger(e ? "CallPlayerLoadComplete" : "CallPlayerLoadError")
            })), this.gp.player.on("login", (e => {
                this.trigger(e ? "CallPlayerLoginComplete" : "CallPlayerLoginError")
            })), this.gp.on("event:connect", (() => this.trigger("CallPlayerConnect"))), this.gp.player.on("fetchFields", (e => {
                e ? this.trigger("CallPlayerFetchFieldsComplete", JSON.stringify(this.gp.player.fields.map((e => ({
                    ...e,
                    defaultValue: e.default
                }))))) : this.trigger("CallPlayerFetchFieldsError")
            })), this.gp.leaderboard.on("open", (() => this.trigger("CallLeaderboardOpen"))), this.gp.leaderboard.on("close", (() => this.trigger("CallLeaderboardClose"))), this.gp.achievements.on("open", (() => this.trigger("CallAchievementsOpen"))), this.gp.achievements.on("close", (() => {
                this.trigger("CallAchievementsClose"), window.focus()
            })), this.gp.achievements.on("unlock", (() => this.trigger("CallAchievementsUnlock"))), this.gp.achievements.on("error:unlock", (() => this.trigger("CallAchievementsUnlockError"))), this.gp.gamesCollections.on("open", (() => this.trigger("CallGamesCollectionsOpen"))), this.gp.gamesCollections.on("close", (() => {
                this.trigger("CallGamesCollectionsClose"), window.focus()
            })), this.gp.fullscreen.on("open", (() => this.trigger("CallFullscreenOpen"))), this.gp.fullscreen.on("close", (() => this.trigger("CallFullscreenClose"))), this.gp.fullscreen.on("change", (() => this.trigger("CallFullscreenChange"))), this.gp.ads.on("start", (() => this.trigger("CallAdsStart"))), this.gp.ads.on("close", (e => {
                this.trigger("CallAdsClose", e), window.focus()
            })), this.gp.ads.on("fullscreen:start", (() => this.trigger("CallAdsFullscreenStart"))), this.gp.ads.on("fullscreen:close", (e => this.trigger("CallAdsFullscreenClose", e))), this.gp.ads.on("preloader:start", (() => this.trigger("CallAdsPreloaderStart"))), this.gp.ads.on("preloader:close", (e => this.trigger("CallAdsPreloaderClose", e))), this.gp.ads.on("rewarded:start", (() => this.trigger("CallAdsRewardedStart"))), this.gp.ads.on("rewarded:close", (e => this.trigger("CallAdsRewardedClose", e))), this.gp.ads.on("rewarded:reward", (() => this.trigger("CallAdsRewardedReward", this.lastRewardedTag))), this.gp.ads.on("sticky:start", (() => this.trigger("CallAdsStickyStart"))), this.gp.ads.on("sticky:close", (() => this.trigger("CallAdsStickyClose"))), this.gp.ads.on("sticky:refresh", (() => this.trigger("CallAdsStickyRefresh"))), this.gp.ads.on("sticky:render", (() => this.trigger("CallAdsStickyRender"))), this.gp.socials.on("share", (e => {
                this.trigger("CallSocialsShare", e), window.focus()
            })), this.gp.socials.on("post", (e => {
                this.trigger("CallSocialsPost", e), window.focus()
            })), this.gp.socials.on("invite", (e => {
                this.trigger("CallSocialsInvite", e), window.focus()
            })), this.gp.socials.on("joinCommunity", (e => {
                this.trigger("CallSocialsJoinCommunity", e), window.focus()
            })), this.gp.on("change:language", (e => this.trigger("CallChangeLanguage", e))), this.gp.on("change:avatarGenerator", (e => this.trigger("CallChangeAvatarGenerator", e))), this.gp.on("pause", (() => this.trigger("CallOnPause"))), this.gp.on("resume", (() => this.trigger("CallOnResume"))), this.gp.documents.on("open", (() => this.trigger("CallOnDocumentsOpen"))), this.gp.documents.on("close", (() => {
                this.trigger("CallOnDocumentsClose"), window.focus()
            })), this.gp.documents.on("fetch", (e => this.trigger("CallOnDocumentsFetchSuccess", e.content))), this.gp.documents.on("error:fetch", (() => this.trigger("CallOnDocumentsFetchError"))), this.gp.channels.on("createChannel", (e => {
                this.trigger("CallOnCreateChannel", JSON.stringify(t(e)))
            })), this.gp.channels.on("error:createChannel", (e => this.trigger("CallOnCreateChannelError"))), this.gp.channels.on("updateChannel", (e => {
                this.trigger("CallOnUpdateChannel", JSON.stringify(t(e)))
            })), this.gp.channels.on("error:updateChannel", (e => this.trigger("CallOnUpdateChannelError"))), this.gp.channels.on("deleteChannel", (() => this.trigger("CallOnDeleteChannelSuccess"))), this.gp.channels.on("event:deleteChannel", (e => {
                this.trigger("CallOnDeleteChannelEvent", e.id)
            })), this.gp.channels.on("error:deleteChannel", (e => this.trigger("CallOnDeleteChannelError"))), this.gp.channels.on("fetchChannel", (e => {
                this.trigger("CallOnFetchChannel", JSON.stringify(t(e)))
            })), this.gp.channels.on("error:fetchChannel", (e => this.trigger("CallOnFetchChannelError"))), this.gp.channels.on("fetchChannels", (e => {
                this.trigger("CallOnFetchChannelsCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchChannels", JSON.stringify(e.items.map(t)))
            })), this.gp.channels.on("error:fetchChannels", (e => this.trigger("CallOnFetchChannelsError"))), this.gp.channels.on("fetchMoreChannels", (e => {
                this.trigger("CallOnFetchMoreChannelsCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMoreChannels", JSON.stringify(e.items.map(t)))
            })), this.gp.channels.on("error:fetchMoreChannels", (e => this.trigger("CallOnFetchMoreChannelsError"))), e.channels.on("openChat", (() => this.trigger("CallOnOpenChat"))), e.channels.on("closeChat", (() => this.trigger("CallOnCloseChat"))), e.channels.on("error:openChat", (e => this.trigger("CallOnOpenChatError"))), this.gp.channels.on("join", (() => this.trigger("CallOnJoinSuccess"))), this.gp.channels.on("event:join", (e => {
                this.trigger("CallOnJoinEvent", JSON.stringify(e))
            })), this.gp.channels.on("error:join", (e => this.trigger("CallOnJoinError"))), this.gp.channels.on("event:joinRequest", (e => {
                this.trigger("CallOnJoinRequest", JSON.stringify(e))
            })), this.gp.channels.on("cancelJoin", (() => this.trigger("CallOnCancelJoinSuccess"))), this.gp.channels.on("event:cancelJoin", (e => {
                this.trigger("CallOnCancelJoinEvent", JSON.stringify(e))
            })), this.gp.channels.on("error:cancelJoin", (e => this.trigger("CallOnCancelJoinError"))), this.gp.channels.on("leave", (() => this.trigger("CallOnLeaveSuccess"))), this.gp.channels.on("event:leave", (e => {
                this.trigger("CallOnLeaveEvent", JSON.stringify(e))
            })), this.gp.channels.on("error:leave", (e => this.trigger("CallOnLeaveError"))), this.gp.channels.on("kick", (() => this.trigger("CallOnKick"))), this.gp.channels.on("error:kick", (e => this.trigger("CallOnKickError"))), this.gp.channels.on("fetchMembers", (e => {
                this.trigger("CallOnFetchMembersCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMembers", JSON.stringify(e.items))
            })), this.gp.channels.on("error:fetchMembers", (e => this.trigger("CallOnFetchMembersError"))), this.gp.channels.on("fetchMoreMembers", (e => {
                this.trigger("CallOnFetchMoreMembersCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMoreMembers", JSON.stringify(e.items))
            })), this.gp.channels.on("error:fetchMoreMembers", (e => this.trigger("CallOnFetchMoreMembersError"))), this.gp.channels.on("mute", (() => this.trigger("CallOnMuteSuccess"))), this.gp.channels.on("event:mute", (e => {
                this.trigger("CallOnMuteEvent", JSON.stringify(e))
            })), this.gp.channels.on("error:mute", (e => this.trigger("CallOnMuteError"))), this.gp.channels.on("unmute", (() => this.trigger("CallOnUnmuteSuccess"))), this.gp.channels.on("event:unmute", (e => {
                this.trigger("CallOnUnmuteEvent", JSON.stringify(e))
            })), this.gp.channels.on("error:unmute", (e => this.trigger("CallOnUnmuteError"))), this.gp.channels.on("sendInvite", (() => this.trigger("CallOnSendInvite"))), this.gp.channels.on("error:sendInvite", (e => this.trigger("CallOnSendInviteError"))), this.gp.channels.on("event:invite", (e => {
                this.trigger("CallOnInvite", JSON.stringify(e))
            })), this.gp.channels.on("cancelInvite", (() => this.trigger("CallOnCancelInviteSuccess"))), this.gp.channels.on("event:cancelInvite", (e => {
                this.trigger("CallOnCancelInviteEvent", JSON.stringify(e))
            })), this.gp.channels.on("error:cancelInvite", (e => this.trigger("CallOnCancelInviteError"))), this.gp.channels.on("acceptInvite", (() => this.trigger("CallOnAcceptInvite"))), this.gp.channels.on("error:acceptInvite", (e => this.trigger("CallOnAcceptInviteError"))), this.gp.channels.on("rejectInvite", (() => this.trigger("CallOnRejectInviteSuccess"))), this.gp.channels.on("event:rejectInvite", (e => {
                this.trigger("CallOnRejectInviteEvent", JSON.stringify(e))
            })), this.gp.channels.on("error:rejectInvite", (e => this.trigger("CallOnRejectInviteError"))), this.gp.channels.on("fetchInvites", (e => {
                this.trigger("CallOnFetchInvitesCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchInvites", JSON.stringify(e.items.map(s)))
            })), this.gp.channels.on("error:fetchInvites", (e => this.trigger("CallOnFetchInvitesError"))), this.gp.channels.on("fetchMoreInvites", (e => {
                this.trigger("CallOnFetchMoreInvitesCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMoreInvites", JSON.stringify(e.items.map(s)))
            })), this.gp.channels.on("error:fetchMoreInvites", (e => this.trigger("CallOnFetchMoreInvitesError"))), this.gp.channels.on("fetchChannelInvites", (e => {
                this.trigger("CallOnFetchChannelInvitesCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchChannelInvites", JSON.stringify(e.items))
            })), this.gp.channels.on("error:fetchChannelInvites", (e => this.trigger("CallOnFetchChannelInvitesError"))), this.gp.channels.on("fetchMoreChannelInvites", (e => {
                this.trigger("CallOnFetchMoreChannelInvitesCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMoreChannelInvites", JSON.stringify(e.items))
            })), this.gp.channels.on("error:fetchMoreChannelInvites", (e => this.trigger("CallOnFetchMoreChannelInvitesError"))), this.gp.channels.on("fetchSentInvites", (e => {
                this.trigger("CallOnFetchSentInvitesCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchSentInvites", JSON.stringify(e.items.map(s)))
            })), this.gp.channels.on("error:fetchSentInvites", (e => this.trigger("CallOnFetchSentInvitesError"))), this.gp.channels.on("fetchMoreSentInvites", (e => {
                this.trigger("CallOnFetchMoreSentInvitesCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMoreSentInvites", JSON.stringify(e.items.map(s)))
            })), this.gp.channels.on("error:fetchMoreSentInvites", (e => this.trigger("CallOnFetchMoreSentInvitesError"))), this.gp.channels.on("acceptJoinRequest", (() => this.trigger("CallOnAcceptJoinRequest"))), this.gp.channels.on("error:acceptJoinRequest", (e => this.trigger("CallOnAcceptJoinRequestError"))), this.gp.channels.on("rejectJoinRequest", (() => this.trigger("CallOnRejectJoinRequestSuccess"))), this.gp.channels.on("event:rejectJoinRequest", (e => {
                this.trigger("CallOnRejectJoinRequestEvent", JSON.stringify(e))
            })), this.gp.channels.on("error:rejectJoinRequest", (e => this.trigger("CallOnRejectJoinRequestError"))), this.gp.channels.on("fetchJoinRequests", (e => {
                this.trigger("CallOnFetchJoinRequestsCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchJoinRequests", JSON.stringify(e.items))
            })), this.gp.channels.on("error:fetchJoinRequests", (e => this.trigger("CallOnFetchJoinRequestsError"))), this.gp.channels.on("fetchMoreJoinRequests", (e => {
                this.trigger("CallOnFetchMoreJoinRequestsCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMoreJoinRequests", JSON.stringify(e.items))
            })), this.gp.channels.on("error:fetchMoreJoinRequests", (e => this.trigger("CallOnFetchMoreJoinRequestsError"))), this.gp.channels.on("fetchSentJoinRequests", (e => {
                this.trigger("CallOnFetchSentJoinRequestsCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchSentJoinRequests", JSON.stringify(e.items.map(s)))
            })), this.gp.channels.on("error:fetchSentJoinRequests", (e => this.trigger("CallOnFetchSentJoinRequestsError"))), this.gp.channels.on("fetchMoreSentJoinRequests", (e => {
                this.trigger("CallOnFetchMoreSentJoinRequestsCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMoreSentJoinRequests", JSON.stringify(e.items.map(s)))
            })), this.gp.channels.on("error:fetchMoreSentJoinRequests", (e => this.trigger("CallOnFetchMoreSentJoinRequestsError"))), this.gp.channels.on("sendMessage", (e => {
                this.trigger("CallOnSendMessage", JSON.stringify(e))
            })), this.gp.channels.on("error:sendMessage", (e => this.trigger("CallOnSendMessageError"))), this.gp.channels.on("event:message", (e => {
                this.trigger("CallOnMessage", JSON.stringify(e))
            })), this.gp.channels.on("editMessage", (e => {
                this.trigger("CallOnEditMessageSuccess", JSON.stringify(e))
            })), this.gp.channels.on("event:editMessage", (e => {
                this.trigger("CallOnEditMessageEvent", JSON.stringify(e))
            })), this.gp.channels.on("error:editMessage", (e => this.trigger("CallOnEditMessageError"))), this.gp.channels.on("deleteMessage", (() => this.trigger("CallOnDeleteMessageSuccess"))), this.gp.channels.on("event:deleteMessage", (e => {
                this.trigger("CallOnDeleteMessageEvent", JSON.stringify(e))
            })), this.gp.channels.on("error:deleteMessage", (e => this.trigger("CallOnDeleteMessageError")))
        }
        trigger(e, t) {
            null !== window.unityInstance && window.unityInstance.SendMessage("GamePushSDK", e, this.toUnity(t))
        }
        toUnity(e) {
            switch (typeof e) {
                case "boolean":
                    return String(e);
                case "number":
                case "string":
                    return e;
                case "object":
                    return JSON.stringify(e)
            }
            return e
        }
        mapItemsWithChannel(e = {}) {
            return {
                ...e,
                ch_private: e.private
            }
        }
        Language() {
            return this.gp.language
        }
        AvatarGenerator() {
            return this.gp.avatarGenerator
        }
        PlatformType() {
            return this.gp.platform.type
        }
        PlatformHasIntegratedAuth() {
            return this.toUnity(this.gp.platform.hasIntegratedAuth)
        }
        PlatformIsExternalLinksAllowed() {
            return this.toUnity(this.gp.platform.isExternalLinksAllowed)
        }
        AppTitle() {
            return this.gp.app.title
        }
        AppDescription() {
            return this.gp.app.description
        }
        AppImage() {
            return this.gp.app.image
        }
        AppUrl() {
            return this.gp.app.url
        }
        PlayerGetID() {
            return this.gp.player.id
        }
        PlayerGetScore() {
            return this.gp.player.score
        }
        PlayerSetScore(e) {
            this.gp.player.score = Number(e)
        }
        PlayerAddScore(e) {
            this.gp.player.score += Number(e)
        }
        PlayerGetName() {
            return this.gp.player.name
        }
        PlayerSetName(e) {
            this.gp.player.name = e
        }
        PlayerGetAvatar() {
            return this.gp.player.avatar
        }
        PlayerSetAvatar(e) {
            this.gp.player.avatar = e
        }
        PlayerGet(e) {
            return this.toUnity(this.gp.player.get(e))
        }
        PlayerSetString(e, t) {
            this.gp.player.set(e, t)
        }
        PlayerSetNumber(e, t) {
            this.gp.player.set(e, t)
        }
        PlayerSetBool(e, t) {
            "True" == t ? t = !0 : "False" == t && (t = !1), this.gp.player.set(e, t)
        }
        PlayerAdd(e, t) {
            this.gp.player.add(e, Number(t))
        }
        PlayerHas(e) {
            return this.toUnity(this.gp.player.has(e))
        }
        PlayerSetFlag(e, t) {
            this.gp.player.set(e, !Boolean(t))
        }
        PlayerToggle(e) {
            this.gp.player.toggle(e)
        }
        PlayerGetFieldName(e) {
            return this.gp.player.getFieldName(e)
        }
        PlayerGetFieldVariantName(e, t) {
            return this.gp.player.getFieldVariantName(e, t)
        }
        PlayerGetFieldVariantAt(e, t) {
            const s = this.gp.player.getField(e).variants[t];
            return s ? s.value : ""
        }
        PlayerGetFieldVariantIndex(e, t) {
            return this.gp.player.getField(e).variants.findIndex((e => e.value === t))
        }
        PlayerReset() {
            this.gp.player.reset()
        }
        PlayerRemove() {
            this.gp.player.remove()
        }
        PlayerSync(e = !1) {
            return this.gp.player.sync({
                override: Boolean(e)
            })
        }
        PlayerLoad() {
            return this.gp.player.load()
        }
        PlayerLogin() {
            return this.gp.player.login()
        }
        PlayerFetchFields() {
            this.gp.player.fetchFields()
        }
        PlayerIsLoggedIn() {
            return this.toUnity(this.gp.player.isLoggedIn)
        }
        PlayerHasAnyCredentials(e) {
            return this.toUnity(this.gp.player.hasAnyCredentials)
        }
        PlayerIsStub(e) {
            return this.toUnity(this.gp.player.isStub)
        }
        LeaderboardOpen(e, t, s, r, n, i) {
            return this.gp.leaderboard.open({
                id: this.gp.player.id,
                orderBy: e.split(",").map((e => e.trim())).filter((e => e)),
                order: t,
                limit: s,
                withMe: r,
                includeFields: n.split(",").map((e => e.trim())).filter((e => e)),
                displayFields: i.split(",").map((e => e.trim())).filter((e => e))
            }).catch(console.warn)
        }
        LeaderboardFetch(e, t, s, r, n, i) {
            return this.gp.leaderboard.fetch({
                id: this.gp.player.id,
                orderBy: t.split(",").map((e => e.trim())).filter((e => e)),
                order: s,
                limit: r,
                withMe: n,
                includeFields: i.split(",").map((e => e.trim())).filter((e => e))
            }).then((t => {
                this.trigger("CallLeaderboardFetchTag", e), this.trigger("CallLeaderboardFetch", JSON.stringify(t.players))
            })).catch((e => {
                console.warn(e), this.trigger("CallLeaderboardFetchError")
            }))
        }
        LeaderboardFetchPlayerRating(e, t, s) {
            return this.gp.leaderboard.fetchPlayerRating({
                id: this.gp.player.id,
                orderBy: t.split(",").map((e => e.trim())).filter((e => e)),
                order: s
            }).then((t => {
                this.trigger("CallLeaderboardFetchPlayerTag", e), this.trigger("CallLeaderboardFetchPlayer", t.player.position)
            })).catch((e => {
                console.warn(e), this.trigger("CallLeaderboardFetchPlayerError")
            }))
        }
        LeaderboardScopedOpen(e, t, s, r, n, i, a) {
            const l = parseInt(e, 10) || 0,
                h = l > 0 ? {
                    id: l
                } : {
                    tag: e
                };
            return this.gp.leaderboard.openScoped({
                ...h,
                variant: t,
                order: s,
                limit: r,
                includeFields: n.split(",").map((e => e.trim())).filter((e => e)),
                displayFields: i.split(",").map((e => e.trim())).filter((e => e)),
                withMe: a
            }).catch(console.warn)
        }
        LeaderboardScopedFetch(e, t, s, r, n, i) {
            const a = parseInt(e, 10) || 0,
                l = a > 0 ? {
                    id: a
                } : {
                    tag: e
                };
            return this.gp.leaderboard.fetchScoped({
                ...l,
                variant: t,
                order: s,
                limit: r,
                includeFields: n.split(",").map((e => e.trim())).filter((e => e)),
                withMe: i
            }).then((s => {
                this.trigger("CallLeaderboardScopedFetchTag", e), this.trigger("CallLeaderboardScopedFetchVariant", t), this.trigger("CallLeaderboardScopedFetch", JSON.stringify(s.players))
            })).catch((e => {
                console.warn(e), this.trigger("CallLeaderboardScopedFetchError")
            }))
        }
        LeaderboardScopedPublishRecord(e, t, s, r, n, i, a, l, h) {
            const o = parseInt(e, 10) || 0,
                g = o > 0 ? {
                    id: o
                } : {
                    tag: e
                };
            return this.gp.leaderboard.publishRecord({
                ...g,
                variant: t,
                override: Boolean(s),
                record: {
                    [r]: n,
                    [i]: a,
                    [l]: h
                }
            }).then((() => {
                this.trigger("CallLeaderboardScopedPublishRecordComplete")
            })).catch((e => {
                console.warn(e), this.trigger("CallLeaderboardScopedPublishRecordError")
            }))
        }
        LeaderboardScopedFetchPlayerRating(e, t, s) {
            const r = parseInt(e, 10) || 0,
                n = r > 0 ? {
                    id: r
                } : {
                    tag: e
                };
            return this.gp.leaderboard.fetchPlayerRatingScoped({
                ...n,
                variant: t,
                includeFields: s.split(",").map((e => e.trim())).filter((e => e))
            }).then((s => {
                this.trigger("CallLeaderboardScopedFetchPlayerTag", e), this.trigger("CallLeaderboardScopedFetchPlayerVariant", t), this.trigger("CallLeaderboardScopedFetchPlayer", s.player.position)
            })).catch((e => {
                console.warn(e), this.trigger("CallLeaderboardFetchPlayerError")
            }))
        }
        AchievementsOpen() {
            return this.gp.achievements.open().catch(console.warn)
        }
        AchievementsFetch() {
            return this.gp.achievements.fetch().then((e => {
                this.trigger("CallAchievementsFetch", JSON.stringify(e.achievements)), this.trigger("CallAchievementsFetchGroups", JSON.stringify(e.achievementsGroups)), this.trigger("CallPlayerAchievementsFetch", JSON.stringify(e.playerAchievements))
            })).catch((e => {
                console.warn(e), this.trigger("CallAchievementsFetchError")
            }))
        }
        AchievementsUnlock(e) {
            const t = parseInt(e, 10) || 0,
                s = t > 0 ? {
                    id: t
                } : {
                    tag: e
                };
            return this.gp.achievements.unlock(s).then((t => {
                t.success ? this.trigger("CallAchievementsUnlock", e) : this.trigger("CallAchievementsUnlockError")
            })).catch((e => {
                console.warn(e), this.trigger("CallAchievementsUnlockError")
            }))
        }
        AchievementsSetProgress(e, t) {
            const s = parseInt(e, 10) || 0,
                r = s > 0 ? {
                    id: s
                } : {
                    tag: e
                };
            return this.gp.achievements.setProgress({
                ...r,
                progress: t
            }).then((t => {
                t.success ? this.trigger("CallAchievementsProgress", e) : this.trigger("CallAchievementsProgressError")
            })).catch((e => {
                console.warn(e), this.trigger("CallAchievementsProgressError")
            }))
        }
        AchievementsHas(e) {
            return this.toUnity(this.gp.achievements.has(e))
        }
        AchievementsGetProgress(e) {
            return this.gp.achievements.getProgress(e)
        }
        PaymentsFetchProducts() {
            return this.gp.payments.fetchProducts().then((e => {
                this.trigger("CallPaymentsFetchProducts", JSON.stringify(e.products)), this.trigger("CallPaymentsFetchPlayerPurcahses", JSON.stringify(e.playerPurchases))
            })).catch((e => {
                console.warn(e), this.trigger("CallPaymentsFetchProductsError")
            }))
        }
        PaymentsPurchase(e) {
            const t = parseInt(e, 10) || 0,
                s = t > 0 ? {
                    id: t
                } : {
                    tag: e
                };
            return this.gp.payments.purchase(s).then((t => {
                if (t.success) return this.trigger("CallPaymentsPurchase", e), void window.focus();
                this.trigger("CallPaymentsPurchaseError", e), window.focus()
            })).catch((e => {
                console.warn(e), this.trigger("CallPaymentsPurchaseError", e), window.focus()
            }))
        }
        PaymentsConsume(e) {
            const t = parseInt(e, 10) || 0,
                s = t > 0 ? {
                    id: t
                } : {
                    tag: e
                };
            return this.gp.payments.consume(s).then((t => {
                if (t.success) return this.trigger("CallPaymentsConsume", e), void window.focus();
                this.trigger("CallPaymentsConsumeError")
            })).catch((e => {
                console.warn(e), this.trigger("CallPaymentsConsumeError")
            }))
        }
        PaymentsHas(e) {
            return this.toUnity(this.gp.payments.has(e))
        }
        PaymentsIsAvailable() {
            return this.toUnity(this.gp.payments.isAvailable)
        }
        PaymentsIsSubscriptionsAvailable() {
            return this.toUnity(this.gp.payments.isSubscriptionsAvailable)
        }
        PaymentsSubscribe(e) {
            const t = parseInt(e, 10) || 0,
                s = t > 0 ? {
                    id: t
                } : {
                    tag: e
                };
            return this.gp.payments.subscribe(s).then((t => {
                t.success ? this.trigger("CallPaymentsSubscribeSuccess", e) : this.trigger("CallPaymentsSubscribeError")
            })).catch((e => {
                console.warn(e), this.trigger("CallPaymentsSubscribeError")
            }))
        }
        PaymentsUnsubscribe(e) {
            const t = parseInt(e, 10) || 0,
                s = t > 0 ? {
                    id: t
                } : {
                    tag: e
                };
            return this.gp.payments.unsubscribe(s).then((t => {
                t.success ? this.trigger("CallPaymentsUnsubscribeSuccess", e) : this.trigger("CallPaymentsUnsubscribeError")
            })).catch((e => {
                console.warn(e), this.trigger("CallPaymentsUnsubscribeError")
            }))
        }
        FullscreenOpen() {
            return this.gp.fullscreen.open()
        }
        FullscreenClose() {
            return this.gp.fullscreen.close()
        }
        FullscreenToggle() {
            return this.gp.fullscreen.toggle()
        }
        AdsShowFullscreen(e = !1) {
            return this.gp.ads.showFullscreen({
                showCountdownOverlay: Boolean(e)
            })
        }
        AdsShowRewarded(e) {
            return this.lastRewardedTag = e, this.gp.ads.showRewardedVideo()
        }
        AdsShowPreloader() {
            return this.gp.ads.showPreloader()
        }
        AdsShowSticky() {
            return this.gp.ads.showSticky()
        }
        AdsCloseSticky() {
            return this.gp.ads.closeSticky()
        }
        AdsRefreshSticky() {
            return this.gp.ads.refreshSticky()
        }
        AdsIsAdblockEnabled() {
            return this.toUnity(this.gp.ads.isAdblockEnabled)
        }
        AdsIsStickyAvailable() {
            return this.toUnity(this.gp.ads.isStickyAvailable)
        }
        AdsIsFullscreenAvailable() {
            return this.toUnity(this.gp.ads.isFullscreenAvailable)
        }
        AdsIsRewardedAvailable() {
            return this.toUnity(this.gp.ads.isRewardedAvailable)
        }
        AdsIsPreloaderAvailable() {
            return this.toUnity(this.gp.ads.isPreloaderAvailable)
        }
        AdsIsStickyPlaying() {
            return this.toUnity(this.gp.ads.isStickyPlaying)
        }
        AdsIsFullscreenPlaying() {
            return this.toUnity(this.gp.ads.isFullscreenPlaying)
        }
        AdsIsRewardedPlaying() {
            return this.toUnity(this.gp.ads.isRewardedPlaying)
        }
        AdsIsPreloaderPlaying() {
            return this.toUnity(this.gp.ads.isPreloaderPlaying)
        }
        AnalyticsHit(e) {
            return this.gp.analytics.hit(e)
        }
        AnalyticsGoal(e, t) {
            return this.gp.analytics.goal(e, t)
        }
        SocialsShare(e, t, s) {
            return this.gp.socials.share({
                text: e,
                url: t,
                image: s
            })
        }
        SocialsPost(e, t, s) {
            return this.gp.socials.post({
                text: e,
                url: t,
                image: s
            })
        }
        SocialsInvite(e, t, s) {
            return this.gp.socials.invite({
                text: e,
                url: t,
                image: s
            })
        }
        SocialsJoinCommunity() {
            return this.gp.socials.joinCommunity()
        }
        SocialsCommunityLink() {
            return this.toUnity(this.gp.socials.communityLink)
        }
        SocialsIsSupportsShare() {
            return this.toUnity(this.gp.socials.isSupportsShare)
        }
        SocialsIsSupportsNativeShare() {
            return this.toUnity(this.gp.socials.isSupportsNativeShare)
        }
        SocialsIsSupportsNativePosts() {
            return this.toUnity(this.gp.socials.isSupportsNativePosts)
        }
        SocialsIsSupportsNativeInvite() {
            return this.toUnity(this.gp.socials.isSupportsNativeInvite)
        }
        SocialsCanJoinCommunity() {
            return this.toUnity(this.gp.socials.canJoinCommunity)
        }
        SocialsIsSupportsNativeCommunityJoin() {
            return this.toUnity(this.gp.socials.isSupportsNativeCommunityJoin)
        }
        GamesCollectionsOpen(e) {
            const t = parseInt(e, 10) || 0,
                s = t > 0 ? {
                    id: t
                } : {
                    tag: e || "ANY"
                };
            return this.gp.gamesCollections.open(s)
        }
        GamesCollectionsFetch(e) {
            const t = parseInt(e, 10) || 0,
                s = t > 0 ? {
                    id: t
                } : {
                    tag: e
                };
            return this.gp.gamesCollections.fetch(s).then((t => {
                this.trigger("CallGamesCollectionsFetchTag", e), this.trigger("CallGamesCollectionsFetch", JSON.stringify(t))
            })).catch((e => {
                console.warn(e), this.trigger("CallGamesCollectionsFetchError")
            }))
        }
        ChangeLanguage(e) {
            return this.gp.changeLanguage(e)
        }
        ChangeLanguageByCode(e = "") {
            return this.gp.changeLanguage(e.toLowerCase())
        }
        ChangeAvatarGenerator(e) {
            return this.gp.changeAvatarGenerator(e)
        }
        LoadOverlay() {
            return this.gp.loadOverlay()
        }
        IsPaused() {
            return this.toUnity(this.gp.isPaused)
        }
        Pause() {
            return this.gp.pause()
        }
        Resume() {
            return this.gp.resume()
        }
        GameReady() {
            return this.gp.gameStart()
        }
        GameplayStart() {
            return this.gp.gameplayStart()
        }
        GameplayStop() {
            return this.gp.gameplayStop()
        }
        IsMobile() {
            return this.toUnity(this.gp.isMobile)
        }
        ServerTime() {
            return this.toUnity(this.gp.serverTime)
        }
        IsDev() {
            return this.toUnity(this.gp.isDev)
        }
        IsAllowedOrigin() {
            return this.toUnity(this.gp.isAllowedOrigin)
        }
        VariablesFetch() {
            return this.gp.variables.fetch().then((e => {
                this.trigger("CallVariablesFetchSuccess", JSON.stringify(e))
            })).catch((e => {
                console.warn(e), this.trigger("CallVariablesFetchError")
            }))
        }
        VariablesHas(e) {
            return this.toUnity(this.gp.variables.has(e))
        }
        VariablesGet(e) {
            return this.toUnity(this.gp.variables.get(e))
        }
        YandexFlagsFetch() {
            return this.gp.platform.getNativeSDK().getFlags().then((flags => {
                let names = [];
                let values = [];

                for (let key in flags) {
                    if (flags.hasOwnProperty(key)) {
                        names.push(key);
                        values.push(flags[key]);
                    }
                }

                let jsonFlags = {
                    "names": names,
                    "values": values
                };

                this.trigger("CallYandexFlagsFetchSuccess", JSON.stringify(jsonFlags))
            })).catch((e => {
                console.warn(e)
            }))
        }
        PlayersFetch(e) {
            var t = JSON.parse(e);
            let s = [];
            s = parseInt(t, 10) > 0 ? [parseInt(t, 10)] : (t.idsList || t.idsArray).map(Number).filter(Boolean), this.gp.players.fetch({
                ids: s
            }).then((e => {
                this.trigger("CallPlayersFetchSuccess", JSON.stringify(e.players))
            })).catch((e => {
                console.warn(e), this.trigger("CallPlayersFetchError")
            }))
        }
        DocumentsOpen() {
            this.gp.documents.open({
                type: "PLAYER_PRIVACY_POLICY"
            })
        }
        DocumentsFetch() {
            this.gp.documents.fetch({
                type: "PLAYER_PRIVACY_POLICY",
                format: "TXT"
            })
        }
        FilesUpload(e) {
            this.gp.files.upload({
                tags: e.split(",").map((e => e.trim())).filter((e => e))
            }).then((e => {
                this.trigger("CallFilesUploadSuccess", JSON.stringify(e))
            })).catch((e => {
                this.trigger("CallFilesUploadError")
            }))
        }
        FilesUploadUrl(e, t, s) {
            this.gp.files.uploadUrl({
                url: e,
                filename: t,
                tags: s.split(",").map((e => e.trim())).filter((e => e))
            }).then((e => {
                this.trigger("CallFilesUploadUrlSuccess", JSON.stringify(e))
            })).catch((e => {
                this.trigger("CallFilesUploadUrlError")
            }))
        }
        FilesUploadContent(e, t, s) {
            this.gp.files.uploadContent({
                content: e,
                filename: t,
                tags: s.split(",").map((e => e.trim())).filter((e => e))
            }).then((e => {
                this.trigger("CallFilesUploadContentSuccess", JSON.stringify(e))
            })).catch((e => {
                this.trigger("CallFilesUploadContentError")
            }))
        }
        FilesLoadContent(e) {
            this.gp.files.loadContent(e).then((e => {
                this.trigger("CallFilesLoadContentSuccess", e)
            })).catch((e => {
                this.trigger("CallFilesLoadContentError")
            }))
        }
        FilesChooseFile(e) {
            this.gp.files.chooseFile(e).then((e => {
                this.trigger("CallFilesChooseFile", e.tempUrl)
            })).catch((e => {
                this.trigger("CallFilesChooseFileError")
            }))
        }
        FilesFetch(e) {
            const t = JSON.parse(e);
            this.gp.files.fetch(t).then((e => {
                this.trigger("CallFilesFetchCanLoadMore", e.canLoadMore), this.trigger("CallFilesFetchSuccess", JSON.stringify(e.items))
            })).catch((e => {
                this.trigger("CallFilesFetchError")
            }))
        }
        FilesFetchMore(e) {
            const t = JSON.parse(e);
            this.gp.files.fetchMore(t).then((e => {
                this.trigger("CallFilesFetchMoreCanLoadMore", e.canLoadMore), this.trigger("CallFilesFetchMoreSuccess", JSON.stringify(e.items))
            })).catch((e => {
                this.trigger("CallFilesFetchMoreError")
            }))
        }
        Channels_Open_Chat(e) {
            -10 == e ? this.gp.channels.openChat() : this.gp.channels.openChat({
                chatId: e
            })
        }
        Channels_IsMainChatEnabled() {
            return this.toUnity(this.gp.channels.isMainChatEnabled)
        }
        Channels_MainChatId() {
            return this.gp.channels.mainChatId
        }
        Channels_Join(e, t) {
            this.gp.channels.join({
                channelId: e,
                password: t
            })
        }
        Channels_CancelJoin(e) {
            this.gp.channels.cancelJoin({
                channelId: e
            })
        }
        Channels_Leave(e) {
            this.gp.channels.leave({
                channelId: e
            })
        }
        Channels_Kick(e, t) {
            this.gp.channels.kick({
                channelId: e,
                playerId: t
            })
        }
        Channels_Mute_UnmuteAt(e, t, s) {
            this.gp.channels.mute({
                channelId: e,
                playerId: t,
                unmuteAt: s
            })
        }
        Channels_Mute_Seconds(e, t, s) {
            this.gp.channels.mute({
                channelId: e,
                playerId: t,
                seconds: Number(s)
            })
        }
        Channels_UnMute(e, t) {
            this.gp.channels.unmute({
                channelId: e,
                playerId: t
            })
        }
        Channels_SendInvite(e, t) {
            this.gp.channels.sendInvite({
                channelId: e,
                playerId: t
            })
        }
        Channels_CancelInvite(e, t) {
            this.gp.channels.cancelInvite({
                channelId: e,
                playerId: t
            })
        }
        Channels_AcceptInvite(e) {
            this.gp.channels.acceptInvite({
                channelId: e
            })
        }
        Channels_RejectInvite(e) {
            this.gp.channels.rejectInvite({
                channelId: e
            })
        }
        Channels_FetchInvites(e, t) {
            this.gp.channels.fetchInvites({
                limit: e,
                offset: t
            })
        }
        Channels_FetchMoreInvites(e) {
            this.gp.channels.fetchMoreInvites({
                limit: e
            })
        }
        Channels_FetchChannelInvites(e, t, s) {
            this.gp.channels.fetchChannelInvites({
                channelId: e,
                limit: t,
                offset: s
            })
        }
        Channels_FetchMoreChannelInvites(e, t) {
            this.gp.channels.fetchMoreChannelInvites({
                channelId: e,
                limit: t
            })
        }
        Channels_FetchSentInvites(e, t, s) {
            this.gp.channels.fetchSentInvites({
                channelId: e,
                limit: t,
                offset: s
            })
        }
        Channels_FetchMoreSentInvites(e, t) {
            this.gp.channels.fetchMoreSentInvites({
                channelId: e,
                limit: t
            })
        }
        Channels_AcceptJoinRequest(e, t) {
            this.gp.channels.acceptJoinRequest({
                channelId: e,
                playerId: t
            })
        }
        Channels_RejectJoinRequest(e, t) {
            this.gp.channels.rejectJoinRequest({
                channelId: e,
                playerId: t
            })
        }
        Channels_FetchJoinRequests(e, t, s) {
            this.gp.channels.fetchJoinRequests({
                channelId: e,
                limit: t,
                offset: s
            })
        }
        Channels_FetchMoreJoinRequests(e, t) {
            this.gp.channels.fetchMoreJoinRequests({
                channelId: e,
                limit: t
            })
        }
        Channels_FetchSentJoinRequests(e, t, s) {
            this.gp.channels.fetchSentJoinRequests({
                channelId: e,
                limit: t,
                offset: s
            })
        }
        Channels_FetchMoreSentJoinRequests(e, t) {
            this.gp.channels.fetchMoreSentJoinRequests({
                channelId: e,
                limit: t
            })
        }
        Channels_SendMessage(e, t, s) {
            this.gp.channels.sendMessage({
                channelId: e,
                text: t,
                tags: s.split(",").map((e => e.trim())).filter((e => e))
            })
        }
        Channels_SendPersonalMessage(e, t, s) {
            this.gp.channels.sendPersonalMessage({
                playerId: e,
                text: t,
                tags: s.split(",").map((e => e.trim())).filter((e => e))
            })
        }
        Channels_SendFeedMessage(e, t, s) {
            this.gp.channels.sendFeedMessage({
                playerId: e,
                text: t,
                tags: s.split(",").map((e => e.trim())).filter((e => e))
            })
        }
        Channels_EditMessage(e, t) {
            this.gp.channels.editMessage({
                messageId: e,
                text: t
            })
        }
        Channels_DeleteMessage(e) {
            this.gp.channels.deleteMessage({
                messageId: e
            })
        }
        Channels_FetchMessages(e, t, s, r) {
            this.gp.channels.fetchMessages({
                channelId: e,
                tags: t.split(",").map((e => e.trim())).filter((e => e)),
                limit: s,
                offset: r
            }).then((e => {
                this.trigger("CallOnFetchMessagesCanLoadMore", JSON.stringify(e.canLoadMore)), this.trigger("CallOnFetchMessages", JSON.stringify(e.items))
            })).catch((e => {
                console.warn(e), this.trigger("CallOnFetchMessagesError")
            }))
        }
        Channels_FetchPersonalMessages(e, t, s, r) {
            this.gp.channels.fetchPersonalMessages({
                playerId: e,
                tags: t.split(",").map((e => e.trim())).filter((e => e)),
                limit: s,
                offset: r
            }).then((e => {
                this.trigger("CallOnFetchPersonalMessagesCanLoadMore", JSON.stringify(e.canLoadMore)), this.trigger("CallOnFetchPersonalMessages", JSON.stringify(e.items))
            })).catch((e => {
                console.warn(e), this.trigger("CallOnFetchPersonalMessagesError")
            }))
        }
        Channels_FetchFeedMessages(e, t, s, r) {
            this.gp.channels.fetchFeedMessages({
                playerId: e,
                tags: t.split(",").map((e => e.trim())).filter((e => e)),
                limit: s,
                offset: r
            }).then((e => {
                this.trigger("CallOnFetchFeedMessagesCanLoadMore", JSON.stringify(e.canLoadMore)), this.trigger("CallOnFetchFeedMessages", JSON.stringify(e.items))
            })).catch((e => {
                console.warn(e), this.trigger("CallOnFetchFeedMessagesError")
            }))
        }
        Channels_FetchMoreMessages(e, t, s) {
            this.gp.channels.fetchMoreMessages({
                channelId: e,
                tags: t.split(",").map((e => e.trim())).filter((e => e)),
                limit: s
            }).then((e => {
                this.trigger("CallOnFetchMoreMessagesCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMoreMessages", JSON.stringify(e.items))
            })).catch((e => {
                console.warn(e), this.trigger("CallOnFetchMoreMessagesError")
            }))
        }
        Channels_FetchMorePersonalMessages(e, t, s) {
            this.gp.channels.fetchMorePersonalMessages({
                playerId: e,
                tags: t.split(",").map((e => e.trim())).filter((e => e)),
                limit: s
            }).then((e => {
                this.trigger("CallOnFetchMorePersonalMessagesCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMorePersonalMessages", JSON.stringify(e.items))
            })).catch((e => {
                console.warn(e), this.trigger("CallOnFetchMorePersonalMessagesError")
            }))
        }
        Channels_FetchMoreFeedMessages(e, t, s) {
            this.gp.channels.fetchMoreFeedMessages({
                playerId: e,
                tags: t.split(",").map((e => e.trim())).filter((e => e)),
                limit: s
            }).then((e => {
                this.trigger("CallOnFetchMoreFeedMessagesCanLoadMore", e.canLoadMore), this.trigger("CallOnFetchMoreFeedMessages", JSON.stringify(e.items))
            })).catch((e => {
                console.warn(e), this.trigger("CallOnFetchMoreFeedMessagesError")
            }))
        }
        Channels_DeleteChannel(e) {
            this.gp.channels.deleteChannel({
                channelId: e
            })
        }
        Channels_FetchChannel(e) {
            this.gp.channels.fetchChannel({
                channelId: e
            })
        }
        Channels_CreateChannel(e) {
            const t = JSON.parse(e);
            this.gp.channels.createChannel({
                ...t,
                private: t.ch_private
            })
        }
        Channels_UpdateChannel(e) {
            const t = JSON.parse(e);
            this.gp.channels.updateChannel({
                ...t,
                private: t.ch_private
            })
        }
        Channels_FetchChannels(e) {
            const t = JSON.parse(e);
            this.gp.channels.fetchChannels(t)
        }
        Channels_FetchMoreChannels(e) {
            const t = JSON.parse(e);
            this.gp.channels.fetchMoreChannels(t)
        }
        Channels_FetchMembers(e) {
            const t = JSON.parse(e);
            this.gp.channels.fetchMembers(t)
        }
        Channels_FetchMoreMembers(e) {
            const t = JSON.parse(e);
            this.gp.channels.fetchMoreMembers(t)
        }
        ExperimentsHas(e, t){
            return this.toUnity(this.gp.experiments.has(e, t));
        }
    }

    function t(e = {}) {
        return {
            ...e,
            ch_private: e.private
        }
    }

    function s(e = {}) {
        return {
            ...e,
            channel: t(e.channel)
        }
    }
    window.GamePushUnity = e, window.GamePushUnity = e
})();
//# sourceMappingURL=gamepush-unity.js.map
