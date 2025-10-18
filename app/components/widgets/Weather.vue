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
    '0': ['lucide:sun', 'error'],
    '1': ['lucide:sun-medium', 'warning'],
    '2': ['lucide:cloud-sun', 'warning'],
    '3': ['lucide:cloudy', 'info'],
    '45': ['lucide:cloud-fog', 'success'],
    '48': ['lucide:cloud-fog', 'success'],
    '51': ['lucide:cloud-drizzle', 'info'],
    '53': ['lucide:cloud-drizzle', 'info'],
    '55': ['lucide:cloud-drizzle', 'info'],
    '56': ['lucide:cloud-snow', 'info'],
    '57': ['lucide:cloud-snow', 'info'],
    '61': ['lucide:cloud-rain', 'info'],
    '63': ['lucide:cloud-rain', 'info'],
    '65': ['lucide:cloud-rain', 'info'],
    '66': ['lucide:cloud-snow', 'info'],
    '67': ['lucide:cloud-snow', 'info'],
    '71': ['lucide:snowflake', 'info'],
    '73': ['lucide:snowflake', 'info'],
    '75': ['lucide:snowflake', 'info'],
    '77': ['lucide:snowflake', 'info'],
    '80': ['lucide:cloud-rain', 'info'],
    '81': ['lucide:cloud-rain', 'info'],
    '82': ['lucide:cloud-rain', 'info'],
    '85': ['lucide:cloud-snow', 'info'],
    '86': ['lucide:cloud-snow', 'info'],
    '95': ['lucide:cloud-lightning', 'warning'],
    '96': ['lucide:cloud-lightning', 'warning'],
    '99': ['lucide:cloud-lightning', 'warning']
}

const currentWeatherIcon = computed(() => weatherCodes[weatherCode.value]?.[0] || 'lucide:circle-question-mark')
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

<template>
    <UPageCard class="h-[310px] bg-default/60 backdrop-blur">
        <div class="flex flex-col justify-center h-full">
            <div v-if="!location || !temperature || !currentWeatherIcon"
                class="text-center text-gray-500 dark:text-gray-400">
                天気を取得中...
                <UProgress animation="swing" class="mx-auto mt-4" />
            </div>
            <div v-else>
                <UIcon :name="currentWeatherIcon" :class="`size-12 mb-2 text-${currentWeatherColor}`" />
                <p class="text-4xl mb-4">{{ location }} {{ temperature }}°C</p>
                <div class="space-y-2">
                    <UUser :name="`${wind} m/s`" :avatar="{icon: 'lucide:wind'}"/>
                    <UUser :name="`${probability}%`" :avatar="{icon: 'lucide:cloud-rain'}"/>
                    <UUser :name="`${humidity}%`" :avatar="{icon: 'lucide:circle-percent'}"/>
                </div>
            </div>
        </div>
    </UPageCard>
</template>
