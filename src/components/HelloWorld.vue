<script setup>
import { usePackageStore } from "./../stores/packager.js";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { ref } from "vue";

const inputText = ref("");
const outputText = ref("");
const fromInput = ref();
const toInput = ref();
const packagerInput = ref();
const formatInput = ref();
const generateUrl = ref();

const packageStore = usePackageStore();
const { PACKAGER, FROM, TO, FORMAT, payload, output } =
  storeToRefs(packageStore);

onBeforeMount(async () => {
  await packageStore.getPackageList();
});

watch(inputText, () => {
  packageStore.setRequestBody(inputText.value);
});

const on = {
  submit: {
    async click() {
      if (fromInput.value && toInput.value) {
        switch (fromInput.value) {
          case "JSON":
            if (toInput.value === "FixedLength") {
              generateUrl.value = `/parser/to/fixedlength/${packagerInput.value}`;
            }
            break;
          // case "FixedLength":
          //   if
        }
      }

      try {
        const res = await packageStore.convert(payload.value, generateUrl);

        output.value = res;

        outputText.value = output.value;
      } catch (error) {
        console.log(error);
      }
    },
  },
  reset: {
    click() {
      (inputText.value = ""),
        (outputText.value = ""),
        (fromInput.value = ""),
        (toInput.value = ""),
        (packagerInput.value = ""),
        (formatInput.value = "");
    },
  },
};
</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <v-card class="pa-4" color="grey-lighten-4">
        <v-card-title class="text-body-1 mb-2">
          Enter ASCII/Unicode text string and press the Convert button:
        </v-card-title>

        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="fromInput"
              :items="FROM"
              label="From"
              density="compact"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="toInput"
              :items="TO"
              label="To"
              density="compact"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row v-if="fromInput === 'FixedLength' && toInput === 'JSON'">
          <v-col cols="12">
            <v-select
              v-model="formatInput"
              :items="FORMAT"
              label="Format List"
              density="compact"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-select
              v-model="packagerInput"
              :items="PACKAGER"
              label="Packager List"
              density="compact"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="inputText"
              label="Text input"
              variant="outlined"
              rows="6"
              clearable
            />
          </v-col>
        </v-row>

        <v-row class="my-2">
          <v-col>
            <v-btn
              color="success"
              prepend-icon="mdi-equal"
              @click="on.submit.click"
            >
              Convert
            </v-btn>
            <v-btn
              class="mx-2"
              color="grey-darken-1"
              variant="tonal"
              prepend-icon="mdi-refresh"
              @click="on.reset.click"
            >
              Reset
            </v-btn>
          </v-col>
        </v-row>

        <v-textarea
          v-if="outputText.hex"
          v-model="outputText.hex"
          label="Hex output"
          variant="outlined"
          rows="6"
          readonly
        />
        <v-textarea
          v-if="outputText.text"
          v-model="outputText.text"
          label="Text output"
          variant="outlined"
          rows="6"
          readonly
        />
      </v-card>
    </v-responsive>
  </v-container>
</template>
