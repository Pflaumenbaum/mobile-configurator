import { ProfileManifest } from "@/definitions/types";
import * as Crypto from "expo-crypto";
import React, { useEffect, useState } from "react";
import { Linking, Platform, ScrollView, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  List,
  RadioButton,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import DateInput from "./dateInput";
import FileInput from "./filePicker";
import IntegerStepper from "./integerStepper";

const validateForm = (fields: any[], state: any, pathPrefix = ""): boolean => {
  for (const field of fields) {
    const path = pathPrefix
      ? `${pathPrefix}.${field.pfm_name}`
      : field.pfm_name;
    const value = getValueByPath(state, path);

    if (field.pfm_require === "always") {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return false;
      }
    }

    if (field.pfm_type === "dictionary" && field.pfm_subkeys) {
      const nested = validateForm(field.pfm_subkeys, state, path);
      if (!nested) return false;
    }

    if (
      field.pfm_type === "array" &&
      Array.isArray(value) &&
      field.pfm_subkeys
    ) {
      for (let i = 0; i < value.length; i++) {
        const nestedPath = `${path}.${i}`;
        const nestedValid = validateForm(field.pfm_subkeys, state, nestedPath);
        if (!nestedValid) return false;
      }
    }
  }
  return true;
};

const getValueByPath = (obj: any, path: string) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const setValueByPath = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const nested = keys.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
  nested[lastKey] = value;
  return { ...obj };
};

const isSystemField = (name: string) =>
  name === "PayloadType" || name === "PayloadUUID";

const PayloadForm = ({
  schema,
  onSubmit,
  initialformState,
}: {
  schema: ProfileManifest;
  onSubmit: (formData: any) => void;
  initialformState?: any;
}) => {
  const [formState, setFormState] = useState<{ [key: string]: any }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (initialformState) {
      setFormState(initialformState);
    } else {
      const initUUID = Crypto.randomUUID();

      const initField = (field: any): any => {
        if (field.pfm_name === "PayloadUUID") return initUUID;

        if (field.pfm_name === "PayloadIdentifier") {
          return field.pfm_default
            ? field.pfm_default + `.${initUUID}`
            : "com.example.profile";
        }

        if (field.pfm_type === "array") return [];
        if (field.pfm_type === "dictionary") {
          const dict: any = {};
          field.pfm_subkeys?.forEach((sub: any) => {
            dict[sub.pfm_name] = initField(sub);
          });
          return dict;
        }

        if (field.pfm_default !== undefined) return field.pfm_default;
        if (field.pfm_type === "boolean") return false;

        return "";
      };

      const initialValues: any = {};
      schema.pfm_subkeys.forEach((field) => {
        initialValues[field.pfm_name] = initField(field);
      });

      setFormState(initialValues);
    }
  }, [schema]);

  useEffect(() => {
    const valid = validateForm(schema.pfm_subkeys, formState);
    setIsFormValid(valid);
  }, [formState, schema]);

  const renderBadges = (field: any) => {
    const platforms = field.pfm_platforms ?? [];
    const badges = platforms.map((p: string) => (
      <Chip
        key={p}
        style={{ marginRight: 4, marginBottom: 4 }}
        mode="flat"
        icon={
          p === "iOS" ? "cellphone" : p === "television" ? "laptop" : "monitor"
        }
      >
        {p}
      </Chip>
    ));

    const versions = [
      ["pfm_ios_min", "cellphone"],
      ["pfm_macos_min", "laptop"],
      ["pfm_tvos_min", "television"],
    ];

    versions.forEach(([key, icon]) => {
      if (field[key]) {
        badges.push(
          <Chip
            key={key}
            style={{ marginRight: 4, marginBottom: 4 }}
            icon={icon}
            theme={{ colors: { primary: "orange" } }}
          >
            ≥ {field[key]}
          </Chip>,
        );
      }
    });

    return (
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 4 }}
      >
        {badges}
      </View>
    );
  };

  const renderField = (field: any, path = field.pfm_name) => {
    const {
      pfm_type,
      pfm_name,
      pfm_title,
      pfm_description,
      pfm_range_list,
      pfm_range_list_titles,
      pfm_require,
      pfm_subkeys,
    } = field;
    const value = getValueByPath(formState, path);

    const updateValue = (newValue: any) => {
      setFormState((prev) => setValueByPath(prev, path, newValue));
    };

    const addArrayItem = () => {
      const newItem: any = {};
      pfm_subkeys?.forEach((sub: any) => {
        newItem[sub.pfm_name] = sub.pfm_default ?? "";
      });
      updateValue([...(value ?? []), newItem]);
    };

    const removeArrayItem = (index: number) => {
      const updated = [...value];
      updated.splice(index, 1);
      updateValue(updated);
    };

    return (
      <Card key={path} style={{ marginBottom: 12 }}>
        <Card.Content>
          <Text variant="titleMedium">{pfm_title || pfm_name}</Text>
          {pfm_description && (
            <Text variant="bodySmall" style={{ marginBottom: 4 }}>
              {pfm_description}
            </Text>
          )}
          {renderBadges(field)}

          {(pfm_type === "string" || pfm_type === "real") && pfm_range_list ? (
            <RadioButton.Group onValueChange={updateValue} value={value}>
              {pfm_range_list.map((val: number | string, idx: number) => (
                <RadioButton.Item
                  key={val.toString()}
                  label={pfm_range_list_titles?.[idx] || val.toString()}
                  value={val.toString()}
                />
              ))}
            </RadioButton.Group>
          ) : pfm_type === "real" &&
            field.pfm_range_min !== undefined &&
            field.pfm_range_max !== undefined ? (
            <IntegerStepper
              min={field.pfm_range_min}
              max={field.pfm_range_max}
              initial={value}
              onChange={(val) => updateValue(val)}
            />
          ) : pfm_type === "string" ? (
            <TextInput
              value={value}
              label={
                pfm_title || pfm_name + (pfm_require === "always" ? " *" : "")
              }
              onChangeText={(text) => updateValue(text)}
              disabled={isSystemField(pfm_name)}
              style={{ marginTop: 8 }}
            />
          ) : pfm_type === "integer" ? (
            <TextInput
              value={value?.toString()}
              label={
                pfm_title || pfm_name + (pfm_require === "always" ? " *" : "")
              }
              keyboardType="numeric"
              onChangeText={(text) => updateValue(parseInt(text) || 0)}
              style={{ marginTop: 8 }}
            />
          ) : pfm_type === "boolean" ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Switch value={value} onValueChange={updateValue} />
              <Text style={{ marginLeft: 8 }}>{pfm_title}</Text>
            </View>
          ) : pfm_type === "date" ? (
            <DateInput label={pfm_title} value={value} onChange={updateValue} />
          ) : pfm_type === "data" ? (
            <FileInput
              label={pfm_title}
              defaultValue={value}
              onChange={updateValue}
            />
          ) : pfm_type === "array" ? (
            <>
              {(value ?? []).map((item: any, idx: number) => (
                <View
                  key={`${path}.${idx}`}
                  style={{
                    marginTop: 8,
                    padding: 8,
                    backgroundColor: theme.colors.tertiaryContainer,
                    borderRadius: 8,
                  }}
                >
                  {pfm_subkeys?.map((subField: any) =>
                    renderField(
                      subField,
                      `${path}.${idx}.${subField.pfm_name}`,
                    ),
                  )}
                  <Button
                    icon="delete"
                    onPress={() => removeArrayItem(idx)}
                    style={{ marginTop: 4 }}
                    compact
                  >
                    Remove
                  </Button>
                </View>
              ))}
              <Button
                mode="outlined"
                onPress={addArrayItem}
                style={{ marginTop: 8 }}
              >
                Add {pfm_title}
              </Button>
            </>
          ) : pfm_type === "dictionary" ? (
            <View style={{ marginTop: 8 }}>
              {pfm_subkeys?.map((subField: any) =>
                renderField(subField, `${path}.${subField.pfm_name}`),
              )}
            </View>
          ) : (
            <Text style={{ marginTop: 8, color: "red" }}>
              Unsupported field type: {pfm_type}
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  const handleSubmit = () => {
    onSubmit(formState);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: Platform.OS !== "web" ? 200 : 20,
      }}
    >
      <Text variant="headlineMedium" style={{ marginBottom: 4 }}>
        {schema.pfm_title}
      </Text>
      <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
        {schema.pfm_description}
      </Text>

      {renderBadges(schema)}

      {schema.pfm_last_modified && (
        <List.Item
          left={() => <Icon source="calendar" size={20} />}
          title="Last update"
          right={() => (
            <Text style={{ color: theme.colors.primary }}>
              {new Date(schema.pfm_last_modified).toLocaleDateString()}
            </Text>
          )}
        />
      )}

      <Text>Domain: {schema.pfm_domain}</Text>
      <Text>
        Format: {schema.pfm_format_version} | Version: {schema.pfm_version}
      </Text>
      {schema.pfm_unique ? (
        <Text>Unique: true</Text>
      ) : (
        <Text>Unique: false</Text>
      )}

      {schema.pfm_documentation_url && (
        <Button
          icon="open-in-new"
          mode="contained-tonal"
          onPress={() => Linking.openURL(schema.pfm_documentation_url || "")}
          style={{ marginVertical: 15 }}
        >
          View Documentation
        </Button>
      )}

      <Divider style={{ marginVertical: 12 }} />

      {schema.pfm_subkeys.map((field: any) => renderField(field))}

      <Button
        disabled={!isFormValid}
        mode="contained"
        onPress={handleSubmit}
        style={{ marginTop: 24 }}
      >
        {initialformState ? "Update Payload" : "Add Payload"}
      </Button>
    </ScrollView>
  );
};

export default PayloadForm;
