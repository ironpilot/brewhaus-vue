<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Brewhaus</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Brewhaus</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <BreweryListItem v-for="brewery in breweries" :key="brewery.id" :brewery="brewery" />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup async lang="ts">
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import BreweryListItem from '@/components/BreweryListItem.vue';
import { getBreweries, Brewery } from '@/data/breweries';
import { ref } from 'vue';

const breweries = ref<Brewery[]>();

const refresh = (ev: CustomEvent) => {
  setTimeout(() => {
    ev.detail.complete();
  }, 3000);
};

getBreweries().then((results) => {
  breweries.value = results ?? [];
});
</script>
