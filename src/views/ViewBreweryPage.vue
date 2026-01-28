<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :text="getBackButtonText()" default-href="/"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="brewery">
      <ion-item>
        <ion-label class="ion-text-wrap">
          <h2>
            {{ brewery.name }}
            <span class="date">
              <ion-note>{{ brewery.breweryType }}</ion-note>
            </span>
          </h2>
          <h3><ion-note>({{ brewery.latitude }}, {{ brewery.longitude }})</ion-note></h3>
        </ion-label>
      </ion-item>

      <div class="ion-padding">
        <h4><a :href="'tel:' + brewery.phone">{{ brewery.phone }}</a></h4>
        <p>
          {{ brewery.address1 }}<br>
          {{ brewery.city }}, {{ brewery.state }} {{ brewery.postalCode }}
        </p>
        <p v-if="brewery.websiteUrl">
          <a @click.stop.prevent="onViewWebsite(brewery.websiteUrl)">{{ brewery.websiteUrl }}</a>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonToolbar,
} from '@ionic/vue';
import {Brewery, getBrewery} from '@/data/breweries';
import {ref} from "vue";
import {Browser} from "@capacitor/browser";

const getBackButtonText = () => {
  const win = window as any;
  const mode = win && win.Ionic && win.Ionic.mode;
  return mode === 'ios' ? 'Brewery List' : '';
};

const route = useRoute();
const brewery = ref<Brewery | undefined>(undefined);

getBrewery(route.params.id as string).then((result: Brewery | void) => {
  if (result) {
    brewery.value = result;
  } else {
    brewery.value = undefined;
  }
}).catch((e) => console.log(e));

const onViewWebsite = (url: string) => {
  Browser.open({ url });
};
</script>

<style scoped>
ion-item {
  --inner-padding-end: 0;
  --background: transparent;
}

ion-label {
  margin-top: 12px;
  margin-bottom: 12px;
}

ion-item h2 {
  font-weight: 600;
}

ion-item .date {
  float: right;
  align-items: center;
  display: flex;
}

ion-item ion-note {
  font-size: 15px;
  margin-right: 12px;
  font-weight: normal;
}

h1 {
  margin: 0;
  font-weight: bold;
  font-size: 22px;
}

p {
  line-height: 22px;
}
</style>
