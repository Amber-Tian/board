<!-- 流程箭头 -->
<template>
  <div class="arrow-container">
    <div class="arrow-tips">
      <div class="process_con" v-for="(process,processProp) in processList" :key="processProp">
        <div
          v-if="process.icon"
          :class=" {processBtn:true,expected:process.prop=='expected'}"
          :style="{backgroundColor:process.color,color:'#000000'}"
        >
          <i class="el-icon-s-promotion" />
        </div>
        <div
          v-else
          class="processBtn"
          :class="{'triangle':process.prop=='going'}"
          :style="{backgroundColor:process.color,color:'#000000'}"
        >
          {{process.flag}}
        </div>
        <div class="processBtn_tile" :style="{color:process.color}">{{process.label}}</div>
      </div>
    </div>
    <div class="arrow-lists">
      <div class="arrow-item" v-for="(item, key, index) in processData" :key="index">
        <div class="arrow-item-title">{{ item.label }}</div>
        <div v-if="isHomeData" class="arrow-item-content">
          <span v-if="processList['add']" :style="{color:processList['add'].color}">{{item.add}}</span>

          <span v-if="processList['update']" :style="{color:processList['update'].color}"> <span v-if="item.update && item.add">-</span>{{item.update}}</span>

          <span :style="{color:processList['going'].color}"> <span v-if="item.going && item.update">-</span>{{item.going}}</span>

          <span :style="{color:processList['finish'].color}">
            <span v-if="item.finish && item.going">-{{item.finish}}</span>
            <span v-show="item.finishDate">{{ item.finishDate }}</span>
          </span>

          <span :style="{color:item.finish && item.abnormal==0?'#fff':processList['abnormal'].color}">
            <span v-if="(item.abnormal && item.finish) || item.abnormal==0 && item.finish">-</span>
            {{item.abnormal}}
          </span>
          
          <span v-if="processList['expected']" :style="{color:item.abnormal && item.expected==0?'#fff':processList['expected'].color}">
            <span v-if="(item.abnormal && item.expected)">-</span>
            {{item.expected}}
          </span>
        </div>
        <div v-else class="arrow-item-content">
          <span v-if="item.finishDate" :style="{'color': processList.finish.color}">{{ item.finishDate }}</span>
          <span v-else-if="item.expectedDate" :style="{'color': processList.expected.color}">{{ item.expectedDate }}</span>
          <span v-else-if="item.going || item.finish || item.abnormal">
            <span :style="{'color': processList.going.color}">
              {{ item.going || 0 }}
            </span>
            -
            <span :style="{'color': processList.finish.color}">
              {{ item.finish || 0 }}
            </span>
            -
            <span :style="{'color': processList.abnormal.color}">
              {{ item.abnormal || 0 }}
            </span>
          </span>
          <span v-else>— —</span>
        </div>
        <el-image class="arrow-item-img" :src="index === 0 ? startImg : (item.dark ? otherImgDark : otherImg)" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProcessArrow',
    props: ['processList', 'processData', 'isHomeData'],
    data() {
      return {
        startImg: require('@/img/ArrOpc1.png'),
        otherImg: require('@/img/ArrOpc2.png'),
        otherImgDark: require('@/img/ArrOpc3.png'),
      }
    },
    computed: {

    },
    mounted() {

    },
    created() {

    },
    methods: {

    }
  }
</script>
<style scoped lang="scss">
@import "src/style/variables";
  $fontSize: 0.8rem;
  .arrow-container {
    width: 100%;
    margin-top: 2vh;
    min-width: $containerMinW;
    .arrow-tips {
      height: 2vh;
      display: flex;
      font-size: $fontSize;
      .process_con {
        display: flex;
        align-items: center;

        .triangle {
          transform: rotate(90deg);
        }

        .expected {
          transform: rotate(270deg);
        }

        .processBtn {
          $btn: $fontSize;
          border-radius: 100%;
          width: $btn;
          height: $btn;
          line-height: $btn;
          text-align: center;
          font-weight: bold;
          margin-right: .2vw;
        }

        .processBtn_tile {
          margin-right: .6vw;
        }
      }
    }
    .arrow-lists {
      display: flex;
      .arrow-item {
        position: relative;
        height: 6vh;
        width: 6.25%;
        font-size: $fontSize;
        min-height: 40px;
        min-width: 80px;
        &:last-child {
          margin-right: 0;
        }

        &:first-child {
          .arrow-item-title, .arrow-item-content {
            margin-left: -1rem;
          }
        }

        &-title {
          text-align: center;
          padding: .25rem 0;
        }

        &-content {
          text-align: center;
          // padding-left: .5rem;
        }

        &-img {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }
    }
  }
</style>