<script setup>
import { usePackageStore } from "./../stores/packager.js";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { ref } from "vue";

const inputText = ref("");
const outputText = ref("");
const fromInput = ref(null);
const toInput = ref(null);
const packagerInput = ref(null);
const formatInput = ref(null);
const generateUrl = ref(null);

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
        }
      }

      try {
        const res = await packageStore.convert(payload.value, generateUrl);

        output.value = res;

        outputText.value = output.value;

        // console.log(output.value);
      } catch (error) {
        console.log(error);
      }
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

        <p class="text-body-2 mb-2">Paste text</p>

        <v-textarea
          v-model="inputText"
          label="Text input"
          variant="outlined"
          rows="6"
        />

        <!-- <v-row>
          <v-col cols="12">
            <p class="text-body-2 mb-2">Character encoding</p>
            <v-select
              v-model="encoding"
              :items="encodings"
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row> -->

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
            >
              Reset
            </v-btn>
            <!-- <v-btn
              color="grey-darken-1"
              variant="tonal"
              prepend-icon="mdi-swap-horizontal"
            >
              Swap
            </v-btn> -->
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
