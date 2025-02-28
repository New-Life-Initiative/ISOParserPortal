<script setup>
import { usePackageStore } from "./../stores/packager.js";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { ref } from "vue";
import { js_beautify } from "js-beautify";

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
      try {
        if (fromInput.value && toInput.value) {
          switch (fromInput.value) {
            case "JSON":
              if (toInput.value === "FixedLength") {
                generateUrl.value = `/parser/to/fixedlength/${packagerInput.value}`;

                const res = await packageStore.convert(
                  payload.value,
                  generateUrl
                );

                output.value = res;

                outputText.value = output.value;

                console.log(output.value);
              }
              break;
            case "FixedLength":
              if (toInput.value === "JSON") {
                generateUrl.value = `/parser/${formatInput.value}/to/json/${packagerInput.value}`;

                const res = await packageStore.convert(
                  payload.value,
                  generateUrl,
                  "text/plain"
                );

                output.value = res;

                outputText.value = output.value;

                outputText.value.json = JSON.stringify(
                  outputText.value.json,
                  null,
                  2
                );
                console.log(outputText.value);
              }
              break;
          }
        }
      } catch (error) {
        console.error(error);
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

const module = {
  rule: {
    submit() {
      let commonRule =
        !!inputText.value &&
        !!fromInput.value &&
        !!toInput.value &&
        !!packagerInput.value;

      let formatRule =
        fromInput.value === "FixedLength" &&
        toInput.value === "JSON" &&
        !formatInput.value;

      if (formatRule) {
        return formatRule;
      }

      return !commonRule;
    },
  },
  copy: {
    copyToClipboard(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Text copied to clipboard!");
    },
  },
  beautify: {
    beautifyJson() {
      try {
        // // Ensure outputText.value is a string
        // const jsonString =
        //   typeof outputText.value === "string"
        //     ? outputText.value
        //     : JSON.stringify(outputText.value);
        // const json = JSON.parse(jsonString); // Parsing input JSON
        // outputText.value = js_beautify(JSON.stringify(json, null, 2)); // Beautify JSON
        outputText.value = js_beautify(outputText.value.json); // Beautify JSON
      } catch (error) {
        console.error("Invalid JSON input:", error);
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
              :disabled="module.rule.submit()"
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
            <v-btn
              class="mx-2"
              color="grey-darken-1"
              variant="tonal"
              prepend-icon="mdi-content-copy"
              @click="module.copy.copyToClipboard(inputText)"
              :disabled="!inputText"
            >
              Copy
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="my-2" v-if="outputText.json">
          <v-col>
            <v-textarea
              v-model="outputText.json"
              label="Text output"
              variant="outlined"
              rows="6"
              readonly
            />
          </v-col>
        </v-row>

        <v-row class="my-2" v-if="outputText.json">
          <v-col class="d-flex justify-space-between">
            <v-btn
              color="success"
              prepend-icon="mdi-content-copy"
              @click="module.copy.copyToClipboard(JSON.parse(outputText.json))"
              :disabled="!outputText.json"
            >
              Copy
            </v-btn>
            <!-- <v-btn
              class="mx-2"
              color="grey-darken-1"
              prepend-icon="mdi-content-cut"
              @click="module.beautify.beautifyJson"
              :disabled="!outputText.json"
            >
              Beautify
            </v-btn> -->
          </v-col>
        </v-row>

        <v-row class="my-2" v-if="outputText.hex">
          <v-col>
            <v-textarea
              v-model="outputText.hex"
              label="Hex output"
              variant="outlined"
              rows="6"
              readonly
            />
          </v-col>
        </v-row>

        <v-row class="my-2" v-if="outputText.hex">
          <v-col>
            <v-btn
              color="success"
              prepend-icon="mdi-content-copy"
              @click="module.copy.copyToClipboard(outputText.hex)"
              :disabled="!outputText.hex"
            >
              Copy
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="my-2" v-if="outputText.text">
          <v-col>
            <v-textarea
              v-model="outputText.text"
              label="Text output"
              variant="outlined"
              rows="6"
              readonly
            />
          </v-col>
        </v-row>

        <v-row class="my-2" v-if="outputText.text">
          <v-col>
            <v-btn
              color="success"
              prepend-icon="mdi-content-copy"
              @click="module.copy.copyToClipboard(outputText.text)"
              :disabled="!outputText.text"
            >
              Copy
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-responsive>
  </v-container>
</template>
