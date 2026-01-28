<template>
  <ion-item lines="full" v-if="brewery" :routerLink="'/brewery/' + brewery.id" :detail="false" class="list-item">
    <ion-label class="ion-text-wrap">
      <h2>
        {{ brewery.name }}
        <ion-note>{{ brewery.breweryType }}</ion-note>

      </h2>
      <p>
        {{ brewery.address1 }}<br>
        {{ brewery.city }}, {{ brewery.state }} {{ brewery.postalCode }}
      </p>
      <p v-if="brewery.websiteUrl">
        <a @click.stop.prevent="onViewWebsite(brewery.websiteUrl)">{{ brewery.websiteUrl }}</a>
      </p>
    </ion-label>
    <ion-icon aria-hidden="true" :icon="chevronForward" v-if="isIos()"></ion-icon>
  </ion-item>
</template>

<script setup lang="ts">
import { IonIcon, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { chevronForward } from 'ionicons/icons';
import {Brewery} from "@/data/breweries";
import { Browser } from '@capacitor/browser';

defineProps({
  brewery: Brewery,
});

const isIos = () => {
  const win = window as any;
  return win && win.Ionic && win.Ionic.mode === 'ios';
};

const onViewWebsite = (url: string) => {
  Browser.open({ url });
};
</script>

<style scoped>
.list-item {
  --padding-start: 10px;
  --padding-top: 10px;
  --inner-padding-end: 0;
}

.list-item ion-label {
  margin:0;
}

.list-item h2 {
  font-weight: 600;
  margin: 0;
}

.list-item p {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 95%;
}

.list-item ion-icon {
  color: #c9c9ca;
}

.list-item ion-note {
  font-size: 15px;
  margin-right: 8px;
  font-weight: normal;
}
</style>
