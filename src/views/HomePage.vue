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
          <ion-title size="large">
            <img src="/assets/beer-mug.svg" alt="Company Logo" class="company-logo">
            Brewhaus
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-searchbar
          :value="searchQuery"
          :animated="true"
          placeholder="Search For Brewery"
          :debounce="200"
          @ionInput="onSearchBreweries($event)"
          @ionClear="onSearchClear()">
      </ion-searchbar>

      <ion-list>
        <BreweryListItem v-for="brewery in breweries" :key="brewery.id" :brewery="brewery" />
      </ion-list>
      <ion-infinite-scroll @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
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
  IonSearchbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTitle,
  IonToolbar, InfiniteScrollCustomEvent,
} from '@ionic/vue';
import {Geolocation, type PermissionStatus, Position} from '@capacitor/geolocation';
import BreweryListItem from '@/components/BreweryListItem.vue';
import {getBreweries, Brewery, searchBreweries, getLocalBreweries} from '@/data/breweries';
import {onMounted, reactive, ref} from 'vue';

const breweries = reactive<Brewery[]>([]);
const searchQuery = ref('');
const pageSize = ref(20);
const currentLocation = ref<Position | undefined>(undefined);

const refresh = (ev: CustomEvent) => {
  searchQuery.value = '';
  breweries.length = 0;
  getList();
  ev.detail.complete();
};

onMounted(() => {
  getList();
});

const getList = () => {
  // Try to get local breweries to populate if location is available.
  Geolocation.checkPermissions()
      .then((status: PermissionStatus) => {
        if (status.coarseLocation === 'granted' || status.location === 'granted') {
          Geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 20000}).then((location) => {
            currentLocation.value = location;
            populateBreweryList();
          });
        } else {
          Geolocation.requestPermissions().then((status) => {
            if (status.coarseLocation === 'granted' || status.location === 'granted') {
              Geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 20000}).then((location) => {
                currentLocation.value = location;
                populateBreweryList();
              });
            } else {
              populateBreweryList();
            }
          }).catch(() => {
            populateBreweryList();
          });
        }
      })
      .catch(() => {
        populateBreweryList();
      });
}

const populateBreweryList = () => {
  const nextPage: number = Math.floor(breweries.length / pageSize.value) + 1;
  if (currentLocation.value) {
    getLocalBreweries({
      lat: Math.round(currentLocation.value.coords.latitude * 10000)/10000,
      lng: Math.round(currentLocation.value.coords.longitude * 10000)/10000,
    },
    nextPage,
    pageSize.value)
      .then((results) => {
        breweries.push(...(results ?? []));
      });
  } else {
    getBreweries(nextPage, pageSize.value).then((results) => {
      breweries.push(...(results ?? []));
    });
  }
}

const onSearchBreweries = (event: any) => {
  const query = event.target.value.toLowerCase();
  searchQuery.value = query;
  searchBreweries(query).then((results) => {
    breweries.length = 0;
    breweries.push(...(results ?? []));
  });
};

const onSearchClear = () => {
  searchQuery.value = '';
  breweries.length = 0;
}

const ionInfinite = (event: InfiniteScrollCustomEvent) => {
  const nextPage: number = Math.floor(breweries.length / pageSize.value) + 1;
  if (searchQuery.value) {
    searchBreweries(searchQuery.value, nextPage, pageSize.value).then((results) => {
      breweries.push(...(results ?? []));
    })
        .finally(() => event.target.complete());
  } else {
    if (currentLocation.value) {
      getLocalBreweries({
            lat: Math.round(currentLocation.value.coords.latitude * 10000) / 10000,
            lng: Math.round(currentLocation.value.coords.longitude * 10000) / 10000,
          },
          nextPage,
          pageSize.value
      ).then((results) => {
        breweries.push(...(results ?? []));
      })
        .finally(() => event.target.complete());
    } else {
      getBreweries(nextPage, pageSize.value).then((results) => {
        breweries.push(...(results ?? []));
      })
          .then((err) => console.log(err))
          .finally(() => event.target.complete());
    }
  }
};
</script>

<style scoped>
.company-logo {
  height: 30px;
}
</style>