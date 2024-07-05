async function getUserProfile(access_token){

    //Avatar = icon_img + snoovatar_img
    //username = subreddit.display_name
    //description = subreddit.description

    let requestHeaders= {
        'Authorization': `bearer ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    await fetch('https://oauth.reddit.com/api/v1/me?raw_json=1', {'headers' : requestHeaders})
    .then((res)=>res.json())
    .then((res)=>console.log(res))
}

async function getUserSubreddits(access_token){
    let requestHeaders= {
        'Authorization': `bearer ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    await fetch('https://oauth.reddit.com/subreddits/mine/subscriber?raw_json=1', {'headers' : requestHeaders})
    .then((res)=>res.json())
    .then((res)=>{

        var subreddits = []
        for(let i = 0; i < res.data.children.length; i++){
            console.log(res.data.children[i].data.display_name)
            this.subreddits.push({
                "sub_name" : res.data.children[i].data.display_name,
                "sub_icon" : res.data.children[i].data.icon_img,
                "description": res.data.children[i].data.public_description
            })
        }
        console.log(this.subreddits)
    })
}
async function getUserPref(access_token){
    let requestHeaders= {
        'Authorization': `bearer ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    await fetch('https://oauth.reddit.com/api/v1/me/prefs?raw_json=1', {'headers' : requestHeaders})
    .then((res)=>res.json())
    .then((res)=>console.log(res))

}

async function changeUserPref(access_token, user_pref){
    /*{
    "accept_pms": one of (`everyone`, `whitelisted`),
    "activity_relevant_ads": boolean value,
    "allow_clicktracking": boolean value,
    "bad_comment_autocollapse": one of (`off`, `low`, `medium`, `high`),
    "beta": boolean value,
    "clickgadget": boolean value,
    "collapse_read_messages": boolean value,
    "compress": boolean value,
    "country_code": one of (`WF`, `JP`, `JM`, `JO`, `WS`, `JE`, `GW`, `GU`, `GT`, `GS`, `GR`, `GQ`, `GP`, `GY`, `GG`, `GF`, `GE`, `GD`, `GB`, `GA`, `GN`, `GM`, `GL`, `GI`, `GH`, `PR`, `PS`, `PW`, `PT`, `PY`, `PA`, `PF`, `PG`, `PE`, `PK`, `PH`, `PN`, `PL`, `PM`, `ZM`, `ZA`, `ZZ`, `ZW`, `ME`, `MD`, `MG`, `MF`, `MA`, `MC`, `MM`, `ML`, `MO`, `MN`, `MH`, `MK`, `MU`, `MT`, `MW`, `MV`, `MQ`, `MP`, `MS`, `MR`, `MY`, `MX`, `MZ`, `FR`, `FI`, `FJ`, `FK`, `FM`, `FO`, `CK`, `CI`, `CH`, `CO`, `CN`, `CM`, `CL`, `CC`, `CA`, `CG`, `CF`, `CD`, `CZ`, `CY`, `CX`, `CR`, `CW`, `CV`, `CU`, `SZ`, `SY`, `SX`, `SS`, `SR`, `SV`, `ST`, `SK`, `SJ`, `SI`, `SH`, `SO`, `SN`, `SM`, `SL`, `SC`, `SB`, `SA`, `SG`, `SE`, `SD`, `YE`, `YT`, `LB`, `LC`, `LA`, `LK`, `LI`, `LV`, `LT`, `LU`, `LR`, `LS`, `LY`, `VA`, `VC`, `VE`, `VG`, `IQ`, `VI`, `IS`, `IR`, `IT`, `VN`, `IM`, `IL`, `IO`, `IN`, `IE`, `ID`, `BD`, `BE`, `BF`, `BG`, `BA`, `BB`, `BL`, `BM`, `BN`, `BO`, `BH`, `BI`, `BJ`, `BT`, `BV`, `BW`, `BQ`, `BR`, `BS`, `BY`, `BZ`, `RU`, `RW`, `RS`, `RE`, `RO`, `OM`, `HR`, `HT`, `HU`, `HK`, `HN`, `HM`, `EH`, `EE`, `EG`, `EC`, `ET`, `ES`, `ER`, `UY`, `UZ`, `US`, `UM`, `UG`, `UA`, `VU`, `NI`, `NL`, `NO`, `NA`, `NC`, `NE`, `NF`, `NG`, `NZ`, `NP`, `NR`, `NU`, `XK`, `XZ`, `XX`, `KG`, `KE`, `KI`, `KH`, `KN`, `KM`, `KR`, `KP`, `KW`, `KZ`, `KY`, `DO`, `DM`, `DJ`, `DK`, `DE`, `DZ`, `TZ`, `TV`, `TW`, `TT`, `TR`, `TN`, `TO`, `TL`, `TM`, `TJ`, `TK`, `TH`, `TF`, `TG`, `TD`, `TC`, `AE`, `AD`, `AG`, `AF`, `AI`, `AM`, `AL`, `AO`, `AN`, `AQ`, `AS`, `AR`, `AU`, `AT`, `AW`, `AX`, `AZ`, `QA`),
    "creddit_autorenew": boolean value,
    "default_comment_sort": one of (`confidence`, `top`, `new`, `controversial`, `old`, `random`, `qa`, `live`),
    "domain_details": boolean value,
    "email_chat_request": boolean value,
    "email_comment_reply": boolean value,
    "email_community_discovery": boolean value,
    "email_digests": boolean value,
    "email_messages": boolean value,
    "email_new_user_welcome": boolean value,
    "email_post_reply": boolean value,
    "email_private_message": boolean value,
    "email_unsubscribe_all": boolean value,
    "email_upvote_comment": boolean value,
    "email_upvote_post": boolean value,
    "email_user_new_follower": boolean value,
    "email_username_mention": boolean value,
    "enable_default_themes": boolean value,
    "enable_followers": boolean value,
    "feed_recommendations_enabled": boolean value,
    "g": one of (`GLOBAL`, `US`, `AR`, `AU`, `BG`, `CA`, `CL`, `CO`, `HR`, `CZ`, `FI`, `FR`, `DE`, `GR`, `HU`, `IS`, `IN`, `IE`, `IT`, `JP`, `MY`, `MX`, `NZ`, `PH`, `PL`, `PT`, `PR`, `RO`, `RS`, `SG`, `ES`, `SE`, `TW`, `TH`, `TR`, `GB`, `US_WA`, `US_DE`, `US_DC`, `US_WI`, `US_WV`, `US_HI`, `US_FL`, `US_WY`, `US_NH`, `US_NJ`, `US_NM`, `US_TX`, `US_LA`, `US_NC`, `US_ND`, `US_NE`, `US_TN`, `US_NY`, `US_PA`, `US_CA`, `US_NV`, `US_VA`, `US_CO`, `US_AK`, `US_AL`, `US_AR`, `US_VT`, `US_IL`, `US_GA`, `US_IN`, `US_IA`, `US_OK`, `US_AZ`, `US_ID`, `US_CT`, `US_ME`, `US_MD`, `US_MA`, `US_OH`, `US_UT`, `US_MO`, `US_MN`, `US_MI`, `US_RI`, `US_KS`, `US_MT`, `US_MS`, `US_SC`, `US_KY`, `US_OR`, `US_SD`),
    "hide_ads": boolean value,
    "hide_downs": boolean value,
    "hide_from_robots": boolean value,
    "hide_ups": boolean value,
    "highlight_controversial": boolean value,
    "highlight_new_comments": boolean value,
    "ignore_suggested_sort": boolean value,
    "in_redesign_beta": boolean value,
    "label_nsfw": boolean value,
    "lang": a valid IETF language tag (underscore separated),
    "legacy_search": boolean value,
    "live_orangereds": boolean value,
    "mark_messages_read": boolean value,
    "media": one of (`on`, `off`, `subreddit`),
    "media_preview": one of (`on`, `off`, `subreddit`),
    "min_comment_score": an integer between -100 and 100,
    "min_link_score": an integer between -100 and 100,
    "monitor_mentions": boolean value,
    "newwindow": boolean value,
    "nightmode": boolean value,
    "no_profanity": boolean value,
    "num_comments": an integer between 1 and 500,
    "numsites": an integer between 1 and 100,
    "organic": boolean value,
    "other_theme": subreddit name,
    "over_18": boolean value,
    "private_feeds": boolean value,
    "profile_opt_out": boolean value,
    "public_votes": boolean value,
    "research": boolean value,
    "search_include_over_18": boolean value,
    "send_crosspost_messages": boolean value,
    "send_welcome_messages": boolean value,
    "show_flair": boolean value,
    "show_gold_expiration": boolean value,
    "show_link_flair": boolean value,
    "show_location_based_recommendations": boolean value,
    "show_presence": boolean value,
    "show_promote": boolean value,
    "show_stylesheets": boolean value,
    "show_trending": boolean value,
    "show_twitter": boolean value,
    "store_visits": boolean value,
    "survey_last_seen_time": an integer,
    "theme_selector": subreddit name,
    "third_party_data_personalized_ads": boolean value,
    "third_party_personalized_ads": boolean value,
    "third_party_site_data_personalized_ads": boolean value,
    "third_party_site_data_personalized_content": boolean value,
    "threaded_messages": boolean value,
    "threaded_modmail": boolean value,
    "top_karma_subreddits": boolean value,
    "use_global_defaults": boolean value,
    "video_autoplay": boolean value,
    }*/
    let requestHeaders= {
        'Authorization': `bearer ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    await fetch('https://oauth.reddit.com/api/v1/me/prefs?raw_json=1', {
        headers : requestHeaders,
        method: "PATCH", 
        body: user_pref
    })
    .then((res)=>res.json())
    .then((res)=>console.log(res))
}

export { getUserProfile, getUserSubreddits, getUserPref, changeUserPref }