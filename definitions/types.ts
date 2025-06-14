export interface ProfileManifest {
  pfm_description?: string;
  pfm_documentation_url?: string;
  pfm_domain: string;
  pfm_format_version: number;
  pfm_interaction?: string;
  pfm_ios_min?: string;
  pfm_last_modified: string;
  pfm_macos_min?: string;
  pfm_platforms: string[];
  pfm_subkeys: PfmSubkey[];
  pfm_targets: string[];
  pfm_title: string;
  pfm_tvos_min?: string;
  pfm_unique: boolean;
  pfm_version: number;
}

export interface PfmSubkey {
  pfm_name: string;
  pfm_title?: string;
  pfm_description?: string;
  pfm_note?: string;
  pfm_type: string;
  pfm_type_input?: string;
  pfm_default?: any;
  pfm_require?: string;
  pfm_format?: string;
  pfm_range_list?: any[];
  pfm_range_list_titles?: string[];
  pfm_range_min?: number;
  pfm_range_max?: number;
  pfm_sensitive?: boolean;
  pfm_excluded?: boolean;

  pfm_ios_min?: string;
  pfm_ios_max?: string;
  pfm_ios_deprecated?: string;

  pfm_macos_min?: string;
  pfm_macos_deprecated?: string;

  pfm_tvos_min?: string;

  pfm_platforms?: string[];

  pfm_subkeys?: PfmSubkey[];
  pfm_conditionals?: PfmConditional[];
  pfm_exclude?: PfmExclude[];
}

export interface PfmConditional {
  pfm_require: string;
  pfm_target_conditions: PfmTargetCondition[];
}

export interface PfmExclude {
  pfm_target_conditions: PfmTargetCondition[];
}

export interface PfmTargetCondition {
  pfm_target: string;
  pfm_present?: boolean;
  pfm_contains_any?: any[];
  pfm_n_contains_any?: any[];
  pfm_range_list?: any[];
  pfm_n_range_list?: any[];
}
