import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from "@/plugins/axiosInstance";

export const usePackageStore = defineStore("packager", () => {
  /* State */
  const PACKAGER = ref();
  const FROM = ref(["JSON", "Custom", "FixedLength"]);
  const TO = ref(["FixedLength", "JSON"]);
  const payload = ref();
  const FORMAT = ref(["Hex", "Text"]);
  const output = ref();
  const isoProperty = ref()

  async function getPackageList() {
    try {
      const res = await axiosInstance.post("/packager/list");

      PACKAGER.value = res.data;

      return;
    } catch (error) {
      console.error("Error get package list", error);
    }
  }

  async function getIsoProperty(iso) {
    try {
      const res = await axiosInstance.get(`/packager/${iso}/property`);
      isoProperty.value = res.data;
      return res.data;
    } catch (error) {
      console.error("Error get ISO property", error);
    }
  }

  async function convert(reqBody, url, contentType) {
    try {
      const headers = isoProperty.value ? {
        'X-Append-Hex-Code': isoProperty.value.appendHexCode,
        'X-Hex-Codec-Yn': isoProperty.value.hexCodecYn,
        'X-Iso-Header-Length': isoProperty.value.isoHeaderLength,
        'X-Message-Bound': isoProperty.value.messageBound,
        'X-Message-Field-Type': isoProperty.value.messageFieldType,
        'X-Message-Length': isoProperty.value.messageLength,
        'X-Message-Length-Offset': isoProperty.value.messageLengthOffset
      } : {};
  
      const isCustomToFixedLength = url.value.includes('/parser/custom/to/fixedlength/');
      const isCustomHexToJson = FORMAT.value.some(format =>
        url.value.includes(`/parser/custom/${format}/to/json/`)
      );
      console.log(isCustomHexToJson);
  
      if (isCustomHexToJson) {
        const res = await axiosInstance.post(url.value, reqBody, {
          headers: {
            "Content-Type": "text/plain", 
            ...headers,
          },
        });
        output.value = res.data.produce;
        return res.data.produce;
      }
  
      if (isCustomToFixedLength) {
        const res = await axiosInstance.post(url.value, reqBody, { headers });
        output.value = res.data.produce;
        return res.data.produce;
      }
  
      const res = await axiosInstance.post(url.value, reqBody, {
        headers: {
          "Content-Type": `${contentType ?? "application/json"}`,
          ...headers,
        },
      });
  
      output.value = res.data.produce;

      return res.data.produce;
    } catch (error) {
      console.error("Error get package list", error);
    }
  }

  function setRequestBody(form) {
    payload.value = form;
  }

  return {
    PACKAGER,
    FROM,
    TO,
    payload,
    FORMAT,
    output,
    getPackageList,
    convert,
    setRequestBody,
    getIsoProperty
  };
});
