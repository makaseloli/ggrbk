<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        rows?: number
        cols?: number
    }>(),
    {
        rows: 20,
        cols: 20
    }
)

const isRunning = ref(false)
const lifetime = 30000
const speed = 100
const cellSize = 5

const rows = ref(props.rows)
const cols = ref(props.cols)
const gridContainer = ref<HTMLElement | null>(null)

let intervalId: ReturnType<typeof setInterval> | null = null
let intervalGo: ReturnType<typeof setInterval> | null = null
let resetTimeoutId: ReturnType<typeof setTimeout> | null = null
let resizeObserver: ResizeObserver | null = null

const createEmptyGrid = (rows: number, cols: number): number[][] =>
    Array.from({ length: rows }, () => Array<number>(cols).fill(0))

const cloneGrid = (source: number[][]): number[][] => source.map(row => [...row])

const grid = ref<number[][]>(createEmptyGrid(rows.value, cols.value))


const getNextGeneration = () => {
    const newGrid = cloneGrid(grid.value)
    for (let r = 0; r < rows.value; r++) {
        const currentRow = grid.value[r]
        const nextRow = newGrid[r]
        if (!currentRow || !nextRow) continue
        for (let c = 0; c < cols.value; c++) {
            const liveNeighbors = countLiveNeighbors(r, c)
            const currentCell = currentRow[c] ?? 0
            if (currentCell === 1) {
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    nextRow[c] = 0
                }
            } else {
                if (liveNeighbors === 3) {
                    nextRow[c] = 1
                }
            }
        }
    }
    grid.value = newGrid
}

const countLiveNeighbors = (row: number, col: number) => {
    let count = 0
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) continue
            const newRow = row + r
            const newCol = col + c
            if (newRow >= 0 && newRow < rows.value && newCol >= 0 && newCol < cols.value) {
                count += grid.value[newRow]?.[newCol] ?? 0
            }
        }
    }
    return count
}


const startSimulation = () => {
    if (isRunning.value) return
    isRunning.value = true
    intervalId = setInterval(() => {
        getNextGeneration()
    }, speed)
}

const stopSimulation = () => {
    isRunning.value = false
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
    }
    if (resetTimeoutId) {
        clearTimeout(resetTimeoutId)
        resetTimeoutId = null
    }
}

const clearGrid = () => {
    stopSimulation()
    grid.value = createEmptyGrid(rows.value, cols.value)
}

const randomizeGrid = () => {
    grid.value = Array.from({ length: rows.value }, () =>
        Array.from({ length: cols.value }, () => (Math.random() > 0.8 ? 1 : 0))
    )
}

const gameStart = () => {
    if (resetTimeoutId) {
        clearTimeout(resetTimeoutId)
        resetTimeoutId = null
    }
    stopSimulation()
    randomizeGrid()
    startSimulation()
    resetTimeoutId = setTimeout(() => {
        clearGrid()
    }, lifetime)
}


watch(
    () => [props.rows, props.cols] as const,
    ([nextRows, nextCols]: readonly [number, number]) => {
        rows.value = Math.max(1, nextRows)
        cols.value = Math.max(1, nextCols)
    }
)

watch(
    () => [rows.value, cols.value] as const,
    ([nextRows, nextCols], [prevRows, prevCols]) => {
        if (nextRows === prevRows && nextCols === prevCols) return
        stopSimulation()
        grid.value = createEmptyGrid(nextRows, nextCols)
        gameStart()
    }
)

const measureGrid = () => {
    const el = gridContainer.value
    if (!el) return
    const { clientWidth, clientHeight } = el
    const nextRows = Math.max(1, Math.floor(clientHeight / cellSize))
    const nextCols = Math.max(1, Math.floor(clientWidth / cellSize))
    if (nextRows !== rows.value || nextCols !== cols.value) {
        rows.value = nextRows
        cols.value = nextCols
    }
}

onMounted(() => {
    nextTick(() => {
        measureGrid()
        if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(() => measureGrid())
            const el = gridContainer.value
            if (el) {
                resizeObserver.observe(el)
            }
        }

        if (!isRunning.value) {
            gameStart()
        }
        intervalGo = setInterval(() => {
            gameStart()
        }, lifetime + 500)
    })
})

onBeforeUnmount(() => {
    stopSimulation()
    if (intervalGo) {
        clearInterval(intervalGo)
        intervalGo = null
    }
    if (resizeObserver) {
        const el = gridContainer.value
        if (el) {
            resizeObserver.unobserve(el)
        }
        resizeObserver.disconnect()
        resizeObserver = null
    }
})
</script>

<template>
    <UPageCard class="h-[310px]">
        <div ref="gridContainer" class="h-full w-full overflow-auto flex flex-col justify-center align-center">
            <table>
                <tbody>
                    <tr v-for="(row, rowIndex) in grid" :key="rowIndex">
                        <td v-for="(cell, colIndex) in row" :key="colIndex" :class="[
                            'transition-colors duration-200',
                            cell === 1
                                ? 'bg-primary-500 dark:bg-primary-400'
                                : ''
                        ]" :style="{
                            height: `${cellSize}px`,
                            width: `${cellSize}px`
                        }"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </UPageCard>
</template>
