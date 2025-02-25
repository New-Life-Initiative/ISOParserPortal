<script setup>
import { usePackageStore } from "./../stores/packager.js";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { ref } from "vue";

const inputText = ref("");
const outputText = ref("");
const fromFormat = ref("Text");
const toFormat = ref("Hexadecimal");
const formats = ref(["Text", "Hexadecimal", "Binary", "Octal", "Decimal"]);
const encoding = ref("ASCII");
const encodings = ref(["ASCII", "UTF-8", "UTF-16", "UTF-32"]);

const packageStore = usePackageStore();
const { PACKAGER } = storeToRefs(packageStore);

onBeforeMount(() => {
  console.log(PACKAGER.value);
  console.log(process.env.VUE_APP_API_URL);
});
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
              v-model="fromFormat"
              :items="formats"
              label="From"
              density="compact"
              variant="outlined"
              @update:model-value="clearOutput"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="toFormat"
              :items="formats"
              label="To"
              density="compact"
              variant="outlined"
              @update:model-value="clearOutput"
            />
          </v-col>
        </v-row>

        <p class="text-body-2 mb-2">Paste text</p>

        <v-textarea
          v-model="inputText"
          label="Text input"
          variant="outlined"
          rows="6"
          @update:model-value="clearOutput"
        />

        <v-row>
          <v-col cols="12">
            <p class="text-body-2 mb-2">Character encoding</p>
            <v-select
              v-model="encoding"
              :items="encodings"
              variant="outlined"
              density="compact"
              @update:model-value="clearOutput"
            />
          </v-col>
        </v-row>

        <v-row class="my-2">
          <v-col>
            <v-btn color="success" prepend-icon="mdi-equal" @click="convert">
              Convert
            </v-btn>
            <v-btn
              class="mx-2"
              color="grey-darken-1"
              variant="tonal"
              prepend-icon="mdi-refresh"
              @click="reset"
            >
              Reset
            </v-btn>
            <v-btn
              color="grey-darken-1"
              variant="tonal"
              prepend-icon="mdi-swap-horizontal"
              @click="swap"
            >
              Swap
            </v-btn>
          </v-col>
        </v-row>

        <v-textarea
          v-model="outputText"
          label="Hex output"
          variant="outlined"
          rows="6"
          readonly
        />
      </v-card>
    </v-responsive>
  </v-container>
</template>
