import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from "@/plugins/axiosInstance";

export const usePackageStore = defineStore("packager", () => {
  /* State */

  const PACKAGER = ref([
    "Base1packager",
    "Europackager",
    "Base24packager",
    "Base24packagerfornpg",
    "Base24packagerforprima",
    "Iso87apackager",
    "Iso87apackagerforbersama",
    "Iso87apackagerforionpay",
    "Iso87apackagerfortax",
    "Iso87apackagerforvisa",
    "Iso87bpackager",
    "Iso87bpackagerforedc",
    "Iso93apackager",
    "Iso93apackagerbbitmap",
    "Iso93bpackager",
  ]);

  async function getPackageList() {
    try {
      const res = await axiosInstance.post("/packager/list");

      console.log(res);
    } catch (error) {
      console.error("Error get package list", error);
    }
  }

  return {
    PACKAGER,
    getPackageList,
  };
});
