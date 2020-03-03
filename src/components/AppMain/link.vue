<template>
      <el-breadcrumb separator="/">
      <el-breadcrumb-item class="line" :to="{ path: $route.path }">{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<style scoped>
       .el-breadcrumb{
        height: 8%;
        width: 100%;
    display: inline-block;
        border-radius: 4px;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
    .line{
        border-left: 3px solid #31c17b;
        padding-left: 10px;
    }
</style>