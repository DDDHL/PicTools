<script setup lang="ts"></script>

<template>
  <div class="setting">
    <div class="list">
      <n-list bordered>
        <template #header> 软件设置 </template>
        <template #footer> Design by holden </template>
        <n-list-item>
          <template #prefix> 单位显示 </template>
          <template #suffix>
            <n-button>Suffix</n-button>
          </template>
          <n-thing title="Thing" title-extra="extra" description="description">
          </n-thing>
        </n-list-item>
        <n-list-item>
          <n-thing title="Thing" title-extra="extra" description="description">
            Biu<br />
            Biu<br />
            Biu<br />
          </n-thing>
          <template #suffix>
            <n-button>Suffix</n-button>
          </template>
        </n-list-item>
      </n-list>
    </div>
  </div>
</template>

<style scoped lang="scss">
.setting {
  width: 100%;
  height: calc(100vh - 35px);
  display: flex;
  justify-content: center;
  @include bgColor();
  .list {
    margin-top: 3vh;
    width: calc(100% - 6vh);
  }
}
</style>
