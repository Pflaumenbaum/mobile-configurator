import { ProfileManifest } from "./types";

import configuration from "@/definitions/Configuration.json";
import com_apple_ADCertificate_managed from "@/definitions/com.apple.ADCertificate.managed.json";
import com_apple_AIM_account from "@/definitions/com.apple.AIM.account.json";
import com_apple_AssetCache_managed from "@/definitions/com.apple.AssetCache.managed.json";
import com_apple_Dictionary from "@/definitions/com.apple.Dictionary.json";
import com_apple_DirectoryService_managed from "@/definitions/com.apple.DirectoryService.managed.json";
import com_apple_DiscRecording from "@/definitions/com.apple.DiscRecording.json";
import com_apple_MCX_EnergySaver from "@/definitions/com.apple.MCX-EnergySaver.json";
import com_apple_MCX_FileVaultOptions from "@/definitions/com.apple.MCX-FileVaultOptions.json";
import com_apple_MCX_GuestAccount from "@/definitions/com.apple.MCX-GuestAccount.json";
import com_apple_MCX_MobileAccounts from "@/definitions/com.apple.MCX-MobileAccounts.json";
import com_apple_MCX_TimeServer from "@/definitions/com.apple.MCX-TimeServer.json";
import com_apple_MCX_WiFiManagedSettings from "@/definitions/com.apple.MCX-WiFiManagedSettings.json";
import com_apple_MCX_FileVault2 from "@/definitions/com.apple.MCX.FileVault2.json";
import com_apple_MCX_TimeMachine from "@/definitions/com.apple.MCX.TimeMachine.json";
import com_apple_NSExtension from "@/definitions/com.apple.NSExtension.json";
import com_apple_SetupAssistant_managed from "@/definitions/com.apple.SetupAssistant.managed.json";
import com_apple_ShareKitHelper from "@/definitions/com.apple.ShareKitHelper.json";
import com_apple_SoftwareUpdate from "@/definitions/com.apple.SoftwareUpdate.json";
import com_apple_SubmitDiagInfo from "@/definitions/com.apple.SubmitDiagInfo.json";
import com_apple_SystemConfiguration from "@/definitions/com.apple.SystemConfiguration.json";
import com_apple_TCC_configuration_profile_policy from "@/definitions/com.apple.TCC.configuration-profile-policy.json";
import com_apple_airplay from "@/definitions/com.apple.airplay.json";
import com_apple_airplay_security from "@/definitions/com.apple.airplay.security.json";
import com_apple_airprint from "@/definitions/com.apple.airprint.json";
import com_apple_app_lock from "@/definitions/com.apple.app.lock.json";
import com_apple_applicationaccess_iOS from "@/definitions/com.apple.applicationaccess-iOS.json";
import com_apple_applicationaccess_macOS from "@/definitions/com.apple.applicationaccess-macOS.json";
import com_apple_applicationaccess_tvOS from "@/definitions/com.apple.applicationaccess-tvOS.json";
import com_apple_applicationaccess_new from "@/definitions/com.apple.applicationaccess.new.json";
import com_apple_appstore from "@/definitions/com.apple.appstore.json";
import com_apple_asam from "@/definitions/com.apple.asam.json";
import com_apple_associated_domains from "@/definitions/com.apple.associated-domains.json";
import com_apple_caldav_account from "@/definitions/com.apple.caldav.account.json";
import com_apple_carddav_account from "@/definitions/com.apple.carddav.account.json";
import com_apple_cellular from "@/definitions/com.apple.cellular.json";
import com_apple_cellularprivatenetwork_managed from "@/definitions/com.apple.cellularprivatenetwork.managed.json";
import com_apple_conferenceroomdisplay from "@/definitions/com.apple.conferenceroomdisplay.json";
import com_apple_configurationprofile_identification from "@/definitions/com.apple.configurationprofile.identification.json";
import com_apple_dashboard from "@/definitions/com.apple.dashboard.json";
import com_apple_declarations from "@/definitions/com.apple.declarations.json";
import com_apple_desktop from "@/definitions/com.apple.desktop.json";
import com_apple_dnsProxy_managed from "@/definitions/com.apple.dnsProxy.managed.json";
import com_apple_dnsSettings_managed from "@/definitions/com.apple.dnsSettings.managed.json";
import com_apple_dock from "@/definitions/com.apple.dock.json";
import com_apple_domains from "@/definitions/com.apple.domains.json";
import com_apple_eas_account from "@/definitions/com.apple.eas.account.json";
import com_apple_education from "@/definitions/com.apple.education.json";
import com_apple_ews_account from "@/definitions/com.apple.ews.account.json";
import com_apple_extensiblesso from "@/definitions/com.apple.extensiblesso.json";
import com_apple_familycontrols_contentfilter from "@/definitions/com.apple.familycontrols.contentfilter.json";
import com_apple_familycontrols_timelimits_v2 from "@/definitions/com.apple.familycontrols.timelimits.v2.json";
import com_apple_fileproviderd from "@/definitions/com.apple.fileproviderd.json";
import com_apple_finder from "@/definitions/com.apple.finder.json";
import com_apple_firstactiveethernet_managed from "@/definitions/com.apple.firstactiveethernet.managed.json";
import com_apple_firstethernet_managed from "@/definitions/com.apple.firstethernet.managed.json";
import com_apple_font from "@/definitions/com.apple.font.json";
import com_apple_gamed from "@/definitions/com.apple.gamed.json";
import com_apple_globalethernet_managed from "@/definitions/com.apple.globalethernet.managed.json";
import com_apple_google_oauth from "@/definitions/com.apple.google-oauth.json";
import com_apple_ironwood_support from "@/definitions/com.apple.ironwood.support.json";
import com_apple_jabber_account from "@/definitions/com.apple.jabber.account.json";
import com_apple_ldap_account from "@/definitions/com.apple.ldap.account.json";
import com_apple_loginitems_managed from "@/definitions/com.apple.loginitems.managed.json";
import com_apple_loginwindow from "@/definitions/com.apple.loginwindow.json";
import com_apple_lom from "@/definitions/com.apple.lom.json";
import com_apple_mail_managed from "@/definitions/com.apple.mail.managed.json";
import com_apple_mcxloginscripts from "@/definitions/com.apple.mcxloginscripts.json";
import com_apple_mcxprinting from "@/definitions/com.apple.mcxprinting.json";
import com_apple_mdm from "@/definitions/com.apple.mdm.json";
import com_apple_mobiledevice_passwordpolicy from "@/definitions/com.apple.mobiledevice.passwordpolicy.json";
import com_apple_networkusagerules from "@/definitions/com.apple.networkusagerules.json";
import com_apple_notificationsettings_iOS from "@/definitions/com.apple.notificationsettings-iOS.json";
import com_apple_notificationsettings_macOS from "@/definitions/com.apple.notificationsettings-macOS.json";
import com_apple_osxserver_account from "@/definitions/com.apple.osxserver.account.json";
import com_apple_preference_security from "@/definitions/com.apple.preference.security.json";
import com_apple_profileRemovalPassword from "@/definitions/com.apple.profileRemovalPassword.json";
import com_apple_proxy_http_global from "@/definitions/com.apple.proxy.http.global.json";
import com_apple_relay_managed from "@/definitions/com.apple.relay.managed.json";
import com_apple_screensaver from "@/definitions/com.apple.screensaver.json";
import com_apple_screensaver_user from "@/definitions/com.apple.screensaver.user.json";
import com_apple_secondactiveethernet_managed from "@/definitions/com.apple.secondactiveethernet.managed.json";
import com_apple_secondethernet_managed from "@/definitions/com.apple.secondethernet.managed.json";
import com_apple_security_FDERecoveryKeyEscrow from "@/definitions/com.apple.security.FDERecoveryKeyEscrow.json";
import com_apple_security_FDERecoveryRedirect from "@/definitions/com.apple.security.FDERecoveryRedirect.json";
import com_apple_security_acme from "@/definitions/com.apple.security.acme.json";
import com_apple_security_certificatepreference from "@/definitions/com.apple.security.certificatepreference.json";
import com_apple_security_certificatetransparency from "@/definitions/com.apple.security.certificatetransparency.json";
import com_apple_security_firewall from "@/definitions/com.apple.security.firewall.json";
import com_apple_security_pem from "@/definitions/com.apple.security.pem.json";
import com_apple_security_pkcs1 from "@/definitions/com.apple.security.pkcs1.json";
import com_apple_security_pkcs12 from "@/definitions/com.apple.security.pkcs12.json";
import com_apple_security_root from "@/definitions/com.apple.security.root.json";
import com_apple_security_scep from "@/definitions/com.apple.security.scep.json";
import com_apple_security_smartcard from "@/definitions/com.apple.security.smartcard.json";
import com_apple_servicemanagement from "@/definitions/com.apple.servicemanagement.json";
import com_apple_shareddeviceconfiguration from "@/definitions/com.apple.shareddeviceconfiguration.json";
import com_apple_sso from "@/definitions/com.apple.sso.json";
import com_apple_subscribedcalendar_account from "@/definitions/com.apple.subscribedcalendar.account.json";
import com_apple_syspolicy_kernel_extension_policy from "@/definitions/com.apple.syspolicy.kernel-extension-policy.json";
import com_apple_system_extension_policy from "@/definitions/com.apple.system-extension-policy.json";
import com_apple_system_logging from "@/definitions/com.apple.system.logging.json";
import com_apple_systemmigration from "@/definitions/com.apple.systemmigration.json";
import com_apple_systempolicy_control from "@/definitions/com.apple.systempolicy.control.json";
import com_apple_systempolicy_managed from "@/definitions/com.apple.systempolicy.managed.json";
import com_apple_systempreferences from "@/definitions/com.apple.systempreferences.json";
import com_apple_systemuiserver from "@/definitions/com.apple.systemuiserver.json";
import com_apple_thirdactiveethernet_managed from "@/definitions/com.apple.thirdactiveethernet.managed.json";
import com_apple_thirdethernet_managed from "@/definitions/com.apple.thirdethernet.managed.json";
import com_apple_tvremote from "@/definitions/com.apple.tvremote.json";
import com_apple_universalaccess from "@/definitions/com.apple.universalaccess.json";
import com_apple_webClip_managed from "@/definitions/com.apple.webClip.managed.json";
import com_apple_webcontent_filter from "@/definitions/com.apple.webcontent-filter.json";
import com_apple_wifi_managed from "@/definitions/com.apple.wifi.managed.json";
import com_apple_xsan from "@/definitions/com.apple.xsan.json";
import com_apple_xsan_preferences from "@/definitions/com.apple.xsan.preferences.json";
import loginwindow from "@/definitions/loginwindow.json";

const Definition = {
  configuration: configuration as ProfileManifest,
  com_apple_ADCertificate_managed:
    com_apple_ADCertificate_managed as ProfileManifest,
  com_apple_AIM_account: com_apple_AIM_account as ProfileManifest,
  com_apple_AssetCache_managed: com_apple_AssetCache_managed as ProfileManifest,
  com_apple_Dictionary: com_apple_Dictionary as ProfileManifest,
  com_apple_DirectoryService_managed:
    com_apple_DirectoryService_managed as ProfileManifest,
  com_apple_DiscRecording: com_apple_DiscRecording as ProfileManifest,
  com_apple_MCX_EnergySaver: com_apple_MCX_EnergySaver as ProfileManifest,
  com_apple_MCX_FileVaultOptions:
    com_apple_MCX_FileVaultOptions as ProfileManifest,
  com_apple_MCX_GuestAccount: com_apple_MCX_GuestAccount as ProfileManifest,
  com_apple_MCX_MobileAccounts: com_apple_MCX_MobileAccounts as ProfileManifest,
  com_apple_MCX_TimeServer: com_apple_MCX_TimeServer as ProfileManifest,
  com_apple_MCX_WiFiManagedSettings:
    com_apple_MCX_WiFiManagedSettings as ProfileManifest,
  com_apple_MCX_FileVault2: com_apple_MCX_FileVault2 as ProfileManifest,
  com_apple_MCX_TimeMachine: com_apple_MCX_TimeMachine as ProfileManifest,
  com_apple_NSExtension: com_apple_NSExtension as ProfileManifest,
  com_apple_SetupAssistant_managed:
    com_apple_SetupAssistant_managed as ProfileManifest,
  com_apple_ShareKitHelper: com_apple_ShareKitHelper as ProfileManifest,
  com_apple_SoftwareUpdate: com_apple_SoftwareUpdate as ProfileManifest,
  com_apple_SubmitDiagInfo: com_apple_SubmitDiagInfo as ProfileManifest,
  com_apple_SystemConfiguration:
    com_apple_SystemConfiguration as ProfileManifest,
  com_apple_TCC_configuration_profile_policy:
    com_apple_TCC_configuration_profile_policy as ProfileManifest,
  com_apple_airplay: com_apple_airplay as ProfileManifest,
  com_apple_airplay_security: com_apple_airplay_security as ProfileManifest,
  com_apple_airprint: com_apple_airprint as ProfileManifest,
  com_apple_app_lock: com_apple_app_lock as ProfileManifest,
  com_apple_applicationaccess_iOS:
    com_apple_applicationaccess_iOS as ProfileManifest,
  com_apple_applicationaccess_macOS:
    com_apple_applicationaccess_macOS as ProfileManifest,
  com_apple_applicationaccess_tvOS:
    com_apple_applicationaccess_tvOS as ProfileManifest,
  com_apple_applicationaccess_new:
    com_apple_applicationaccess_new as ProfileManifest,
  com_apple_appstore: com_apple_appstore as ProfileManifest,
  com_apple_asam: com_apple_asam as ProfileManifest,
  com_apple_associated_domains: com_apple_associated_domains as ProfileManifest,
  com_apple_caldav_account: com_apple_caldav_account as ProfileManifest,
  com_apple_carddav_account: com_apple_carddav_account as ProfileManifest,
  com_apple_cellular: com_apple_cellular as ProfileManifest,
  com_apple_cellularprivatenetwork_managed:
    com_apple_cellularprivatenetwork_managed as ProfileManifest,
  com_apple_conferenceroomdisplay:
    com_apple_conferenceroomdisplay as ProfileManifest,
  com_apple_configurationprofile_identification:
    com_apple_configurationprofile_identification as ProfileManifest,
  com_apple_dashboard: com_apple_dashboard as ProfileManifest,
  com_apple_declarations: com_apple_declarations as ProfileManifest,
  com_apple_desktop: com_apple_desktop as ProfileManifest,
  com_apple_dnsProxy_managed: com_apple_dnsProxy_managed as ProfileManifest,
  com_apple_dnsSettings_managed:
    com_apple_dnsSettings_managed as ProfileManifest,
  com_apple_dock: com_apple_dock as ProfileManifest,
  com_apple_domains: com_apple_domains as ProfileManifest,
  com_apple_eas_account: com_apple_eas_account as ProfileManifest,
  com_apple_education: com_apple_education as ProfileManifest,
  com_apple_ews_account: com_apple_ews_account as ProfileManifest,
  com_apple_extensiblesso: com_apple_extensiblesso as ProfileManifest,
  com_apple_familycontrols_contentfilter:
    com_apple_familycontrols_contentfilter as ProfileManifest,
  com_apple_familycontrols_timelimits_v2:
    com_apple_familycontrols_timelimits_v2 as ProfileManifest,
  com_apple_fileproviderd: com_apple_fileproviderd as ProfileManifest,
  com_apple_finder: com_apple_finder as ProfileManifest,
  com_apple_firstactiveethernet_managed:
    com_apple_firstactiveethernet_managed as ProfileManifest,
  com_apple_firstethernet_managed:
    com_apple_firstethernet_managed as ProfileManifest,
  com_apple_font: com_apple_font as ProfileManifest,
  com_apple_gamed: com_apple_gamed as ProfileManifest,
  com_apple_globalethernet_managed:
    com_apple_globalethernet_managed as ProfileManifest,
  com_apple_google_oauth: com_apple_google_oauth as ProfileManifest,
  com_apple_ironwood_support: com_apple_ironwood_support as ProfileManifest,
  com_apple_jabber_account: com_apple_jabber_account as ProfileManifest,
  com_apple_ldap_account: com_apple_ldap_account as ProfileManifest,
  com_apple_loginitems_managed: com_apple_loginitems_managed as ProfileManifest,
  com_apple_loginwindow: com_apple_loginwindow as ProfileManifest,
  com_apple_lom: com_apple_lom as ProfileManifest,
  com_apple_mail_managed: com_apple_mail_managed as ProfileManifest,
  com_apple_mcxloginscripts: com_apple_mcxloginscripts as ProfileManifest,
  com_apple_mcxprinting: com_apple_mcxprinting as ProfileManifest,
  com_apple_mdm: com_apple_mdm as ProfileManifest,
  com_apple_mobiledevice_passwordpolicy:
    com_apple_mobiledevice_passwordpolicy as ProfileManifest,
  com_apple_networkusagerules: com_apple_networkusagerules as ProfileManifest,
  com_apple_notificationsettings_iOS:
    com_apple_notificationsettings_iOS as ProfileManifest,
  com_apple_notificationsettings_macOS:
    com_apple_notificationsettings_macOS as ProfileManifest,
  com_apple_osxserver_account: com_apple_osxserver_account as ProfileManifest,
  com_apple_preference_security:
    com_apple_preference_security as ProfileManifest,
  com_apple_profileRemovalPassword:
    com_apple_profileRemovalPassword as ProfileManifest,
  com_apple_proxy_http_global: com_apple_proxy_http_global as ProfileManifest,
  com_apple_relay_managed: com_apple_relay_managed as ProfileManifest,
  com_apple_screensaver: com_apple_screensaver as ProfileManifest,
  com_apple_screensaver_user: com_apple_screensaver_user as ProfileManifest,
  com_apple_secondactiveethernet_managed:
    com_apple_secondactiveethernet_managed as ProfileManifest,
  com_apple_secondethernet_managed:
    com_apple_secondethernet_managed as ProfileManifest,
  com_apple_security_FDERecoveryKeyEscrow:
    com_apple_security_FDERecoveryKeyEscrow as ProfileManifest,
  com_apple_security_FDERecoveryRedirect:
    com_apple_security_FDERecoveryRedirect as ProfileManifest,
  com_apple_security_acme: com_apple_security_acme as ProfileManifest,
  com_apple_security_certificatepreference:
    com_apple_security_certificatepreference as ProfileManifest,
  com_apple_security_certificatetransparency:
    com_apple_security_certificatetransparency as ProfileManifest,
  com_apple_security_firewall: com_apple_security_firewall as ProfileManifest,
  com_apple_security_pem: com_apple_security_pem as ProfileManifest,
  com_apple_security_pkcs1: com_apple_security_pkcs1 as ProfileManifest,
  com_apple_security_pkcs12: com_apple_security_pkcs12 as ProfileManifest,
  com_apple_security_root: com_apple_security_root as ProfileManifest,
  com_apple_security_scep: com_apple_security_scep as ProfileManifest,
  com_apple_security_smartcard: com_apple_security_smartcard as ProfileManifest,
  com_apple_servicemanagement: com_apple_servicemanagement as ProfileManifest,
  com_apple_shareddeviceconfiguration:
    com_apple_shareddeviceconfiguration as ProfileManifest,
  com_apple_sso: com_apple_sso as ProfileManifest,
  com_apple_subscribedcalendar_account:
    com_apple_subscribedcalendar_account as ProfileManifest,
  com_apple_syspolicy_kernel_extension_policy:
    com_apple_syspolicy_kernel_extension_policy as ProfileManifest,
  com_apple_system_extension_policy:
    com_apple_system_extension_policy as ProfileManifest,
  com_apple_system_logging: com_apple_system_logging as ProfileManifest,
  com_apple_systemmigration: com_apple_systemmigration as ProfileManifest,
  com_apple_systempolicy_control:
    com_apple_systempolicy_control as ProfileManifest,
  com_apple_systempolicy_managed:
    com_apple_systempolicy_managed as ProfileManifest,
  com_apple_systempreferences: com_apple_systempreferences as ProfileManifest,
  com_apple_systemuiserver: com_apple_systemuiserver as ProfileManifest,
  com_apple_thirdactiveethernet_managed:
    com_apple_thirdactiveethernet_managed as ProfileManifest,
  com_apple_thirdethernet_managed:
    com_apple_thirdethernet_managed as ProfileManifest,
  com_apple_tvremote: com_apple_tvremote as ProfileManifest,
  com_apple_universalaccess: com_apple_universalaccess as ProfileManifest,
  com_apple_webClip_managed: com_apple_webClip_managed as ProfileManifest,
  com_apple_webcontent_filter: com_apple_webcontent_filter as ProfileManifest,
  com_apple_wifi_managed: com_apple_wifi_managed as ProfileManifest,
  com_apple_xsan: com_apple_xsan as ProfileManifest,
  com_apple_xsan_preferences: com_apple_xsan_preferences as ProfileManifest,
  loginwindow: loginwindow as ProfileManifest,
};

export default Definition;
