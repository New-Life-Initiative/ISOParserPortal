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

  async function getPackageList() {
    try {
      const res = await axiosInstance.post("/packager/list");

      PACKAGER.value = res.data;

      return;
    } catch (error) {
      console.error("Error get package list", error);
    }
  }

  async function convert(reqBody, url, contentType) {
    try {
      const res = await axiosInstance.post(`${url.value}`, reqBody, {
        headers: {
          "Content-Type": `${contentType ?? "application/json"}`,
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
  };
});
