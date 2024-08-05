<template>
  <div class="todo-page">
    <div class="page-left">
      <div class="progress-bar" :style="{ height: height + 'px' }">
        <div class="progress" :style="{ width: progress + '%' }"></div>
        <!-- <div class="plan">
      <div
        v-for="(item, index) in plan"
        :key="index"
        class="plan-item"
        :style="{ left: item.start + '%', width: item.duration + '%', height: height + 'px' }"
      >
        {{ item.title }}
      </div>
    </div> -->
      </div>
      <!-- 添加todo -->
      <div class="plan-form">
        <t-input
          v-model="todoConfig.title"
          class="add-box"
          @enter="addTodo"
          size="large"
          placeholder="do something?"
          required
        />

        <div class="todo-config-box">
          <div class="box-row">
            <t-icon
              class="type todo-config-item"
              :name="todoConfig.type"
              @click="todoConfig.type = todoConfig.type === 'work' ? 'book' : 'work'"
            ></t-icon>
            <t-select
              v-model="todoConfig.way"
              class="way todo-config-item"
              :options="wayOptions"
              placeholder="结算方式"
              clearable
            ></t-select>
            <t-input-number
              v-if="todoConfig.way === 'time'"
              v-model="todoConfig.duration"
              theme="normal"
              align="right"
              class="duration todo-config-item"
            >
              <template #label
                ><span style="line-height: 22px"
                  >{{ todoConfig.checked.includes('isDaily') ? '每日' : '总' }}时长：<t-icon
                    name="add"
                    @click="todoConfig.duration += 30"
                  ></t-icon></span
              ></template>
              <template #suffix><span>min</span></template>
            </t-input-number>
            <t-date-picker
              v-if="!todoConfig.checked.includes('isDaily')"
              class="deadline todo-config-item"
              v-model="todoConfig.deadline"
              placeholder="截至日期"
            />
          </div>
          <div class="box-row">
            <t-checkbox-group
              v-model="todoConfig.checked"
              :options="[{ label: '是否每日重复', value: 'isDaily' }]"
              name="isDaily"
              class="checked todo-config-item"
            ></t-checkbox-group>
            <t-color-picker
              v-model="todoConfig.color"
              :show-primary-color-preview="false"
              format="HEX"
              class="color todo-config-item"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- todoList -->
    <div class="page-right">
      <div class="todoList-box">
        <div class="daily-box">
          <h2>daily</h2>
          <div class="daily-work-box">
            <div
              class="daily-item todoList-item"
              v-for="(it, idx) in todoList"
              :key="idx"
              :style="{ backgroundColor: it.color + '80', borderColor: it.color }"
            >
              <div
                v-if="it.way === 'time' && it.status === 'doing'"
                class="todoList-progress"
                :style="{
                  width:
                    ((it.dailyDuration +
                      (currentSeconds - it.timeline[it.timeline.length - 1][0])) /
                      it.timePlan) *
                      100 +
                    '%'
                }"
              ></div>
              <div v-else class="todoList-progress" :style="{ width: it.progress + '%' }"></div>
              <div class="todoList-way">{{ it.way === 'time' ? '计时' : '非计时' }}</div>
              <div class="todoList-duration">
                {{
                  it.status === 'doing'
                    ? secondsToTime(
                        it.dailyDuration + (currentSeconds - it.timeline[it.timeline.length - 1][0])
                      )
                    : secondsToTime(it.dailyDuration)
                }}
              </div>
              <div class="todoList-item-content">
                <t-icon class="todoList-icon" :name="it.type.split('_')[1]"></t-icon>

                <h5 class="todoList-title" :title="it.title">{{ it.title }}</h5>
                <h4 style="cursor: pointer" @click="todoOperate(it)">
                  <span>{{ statusToBtnText[it.status] }}</span>
                </h4>
                <h4
                  v-if="
                    ((it.way === 'event' && it.status === 'pause') || it.progress >= 100) &&
                    it.status !== 'finished'
                  "
                  style="cursor: pointer"
                  @click="todoOperate(it, 'finish')"
                >
                  <span>完成</span>
                </h4>
              </div>
            </div>
          </div>
          <div class="daily-study-box"></div>
        </div>
        <div class="nodaily-box"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      progress: 0, // 今日时间轴进度
      currentSeconds: '', // 今天过去的秒数
      totalSecondsInDay: 24 * 3600, // 一日总秒数
      startOfDay: 0, // 今天0:00的时间戳

      // form配置（addToDo）
      todoConfig: {
        title: '',
        type: 'work',
        way: 'event',
        checked: [],
        duration: 0,
        color: ''
      },
      // 待办列表数据
      todoList: [
        {
          todoId: '1',
          type: 'daily_work',
          title: '日常1',
          way: 'event',
          status: 'notStart',
          timePlan: 0,
          dailyDuration: 0,
          totalDuration: 6000,
          progress: 0,
          color: '#ff6347',
          timeline: [[]]
        },
        {
          todoId: '2',
          type: 'daily_work',
          title: '日常2日常2日常2日常2日常2日常2日常2日常2日常2日常2日常2日常2日常2',
          way: 'time',
          status: 'notStart',
          timePlan: 36,
          dailyDuration: 0,
          totalDuration: 6600,
          progress: 0,
          color: '#ffa500',
          timeline: [[]]
        }
      ],
      // 枚举（way）
      wayOptions: [
        { label: '按事件', value: 'event' },
        { label: '按时长', value: 'time' }
      ],
      // 状态->操作文本
      statusToBtnText: {
        notStart: '开始',
        doing: '暂停',
        pause: '继续',
        finished: '已完成'
      }
    }
  },

  mounted() {
    // 获取今天0:00的时间戳
    const today = new Date()
    this.startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    // 计时器：记录今天过去的秒数，并计算百分比
    setInterval(() => {
      const now = new Date()
      const diff = now - this.startOfDay
      this.currentSeconds = Math.floor(diff / 1000)
      this.progress = (this.currentSeconds / this.totalSecondsInDay) * 100
    }, 1000)
  },

  methods: {
    /**
     * todoItem操作
     * @param todoItem 待办对象
     * @param status 当前待办状态(非必填)
     * */
    todoOperate(todoItem, status = '') {
      const len = todoItem.timeline.length
      switch (status || todoItem.status) {
        case 'notStart':
          todoItem.status = 'doing'
          todoItem.timeline[0][0] = this.currentSeconds
          break
        case 'doing':
          todoItem.status = 'pause'
          todoItem.timeline[len - 1][1] = this.currentSeconds
          todoItem.dailyDuration += todoItem.timeline[len - 1][1] - todoItem.timeline[len - 1][0]
          todoItem.progress = todoItem.timePlan
            ? (todoItem.dailyDuration / todoItem.timePlan) * 100
            : 0
          break
        case 'pause':
          todoItem.status = 'doing'
          todoItem.timeline[len - 1][0] = this.currentSeconds
          break
        case 'finish':
          todoItem.status = 'finished'
          todoItem.progress = 100
          break

        default:
          break
      }
    },

    // 添加todo
    addTodo() {
      const { title, type, way, checked, duration, color } = this.todoConfig
      const typeGroup = checked[0] ? `daily_${type}` : `nodaily_${type}`
      this.todoList.push({
        type: typeGroup,
        title,
        way,
        status: 'notStart',
        timePlan: duration,
        dailyDuration: 0,
        totalDuration: 0,
        progress: 0,
        color,
        timeline: [[]]
      })
    },

    // 秒->时:分:秒
    secondsToTime(seconds) {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60

      return hours + ':' + minutes + ':' + remainingSeconds
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
