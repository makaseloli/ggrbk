<template>
    <v-card height="310px">
        <v-skeleton-loader v-if="!location && !temperature" type="article"></v-skeleton-loader>
        <div v-else>
            <v-card-item :title="location" class="pb-0"></v-card-item>

            <v-card-text class="py-0">
                <v-row align="center" no-gutters>
                    <v-col class="text-h2" cols="5.5">
                        {{ temperature }}&deg;C
                    </v-col>

                    <v-col class="text-right" cols="5.5">
                        <v-icon :color="currentWeatherColor" :icon="currentWeatherIcon" size="88"></v-icon>
                    </v-col>
                </v-row>
            </v-card-text>

            <div class="py-3">
                <v-list-item density="compact" prepend-icon="mdi-weather-windy">
                    <v-list-item-subtitle>{{ wind }} km/h</v-list-item-subtitle>
                </v-list-item>

                <v-list-item density="compact" prepend-icon="mdi-weather-pouring">
                    <v-list-item-subtitle>{{ probability }}%</v-list-item-subtitle>
                </v-list-item>

                <v-list-item density="compact" prepend-icon="mdi-water-percent">
                    <v-list-item-subtitle>{{ humidity }}%</v-list-item-subtitle>
                </v-list-item>
            </div>
        </div>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, h, computed } from 'vue'

const latlong = ref({ lat: 0, lon: 0 })
const location = ref('')
const temperature = ref('')
const wind = ref('')
const probability = ref('')
const humidity = ref('')
const weatherCode = ref('')

const weatherCodes: Record<string, [string, string]> = {
    '0': ['mdi-weather-sunny', 'success'],
    '1': ['mdi-weather-partly-cloudy', 'warning'],
    '2': ['mdi-weather-cloudy', 'info'],
    '3': ['mdi-weather-overcast', 'info'],
    '45': ['mdi-weather-fog', 'error'],
    '48': ['mdi-weather-fog', 'error'],
}

const currentWeatherIcon = computed(() => weatherCodes[weatherCode.value]?.[0] || 'mdi-help-circle')
const currentWeatherColor = computed(() => weatherCodes[weatherCode.value]?.[1] || 'info')

const getLocalCity = async (lat: number, lon: number) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=*`
    )
    const data = await res.json()

    if (!data.address) return null

    return data.address.city || data.address.town || data.address.village || data.address.county || null
}

const getWeatherData = async (lat: number, lon: number) => {
    const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation_probability`
    )
    const data = await res.json()
    return data
}

onMounted(() => {
    if (typeof window === 'undefined') return

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            latlong.value = { lat: latitude, lon: longitude };
            getLocalCity(latitude, longitude).then((city) => {
                location.value = city || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
            })
            getWeatherData(latitude, longitude).then((weather) => {
                console.log(weather)
                temperature.value = weather.hourly.temperature_2m[0].toFixed(1)
                wind.value = weather.hourly.wind_speed_10m[0].toFixed(1)
                probability.value = weather.hourly.precipitation_probability[0].toFixed(1)
                humidity.value = weather.hourly.relative_humidity_2m[0].toFixed(1)
                weatherCode.value = weather.hourly.weather_code[0].toString()
            })
        },
        (err) => {
        }
    );
})
</script>