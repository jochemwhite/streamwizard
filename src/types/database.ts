import type { Database } from "./supabase";


export type PublicSchema = Database['public']['Tables']
// TABLES
export type CommandTable = PublicSchema['commands']['Row']
export type SpotifyBannedChatterTable = PublicSchema['spotify_banned_chatters']['Row']
export type SpotifySettingsTable = PublicSchema['spotify_settings']['Row']
export type SpotifyBannedSongsTable = PublicSchema['spotify_banned_songs']['Row']
export type TwitchIntegrationTable = PublicSchema['twitch_integration']['Row']
export type WorkflowTable = PublicSchema['workflows']['Row']




// UPDATE TABELS
export type UpdateSpotifySettingsTable = PublicSchema['spotify_settings']['Update']
export type UpdateSpotifyBannedSongsTable = PublicSchema['spotify_banned_songs']['Update']
export type UpdateSpotifyBannedChatterTable = PublicSchema['spotify_banned_chatters']['Update']
export type UpdateTwitchIntegrationTable = PublicSchema['twitch_integration']['Update']
export type UpdateCommandsTable = PublicSchema['commands']['Update']
export type UpdateWorkflowTable = PublicSchema['workflows']['Row']



// INSERT TABLES
export type InsertCommandTable = PublicSchema['commands']['Insert']
export type InsertSpotifySettingsTable = PublicSchema['spotify_settings']['Insert']
export type InsertSpotifyBannedSongsTable = PublicSchema['spotify_banned_songs']['Insert']
export type InserSpotifyBannedChatterTable = PublicSchema['spotify_banned_chatters']['Insert']
export type InsertTwitchIntegrationTable = PublicSchema['twitch_integration']['Insert']
export type InsertWorkflowTable = PublicSchema['workflows']['Insert']




// enums 
export type PublicEnums = Database['public']['Enums']

export type Actions = PublicEnums['actions']