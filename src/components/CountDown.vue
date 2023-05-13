<template>
    <div>{{ days }} 天 {{ hours }} 小时 {{ minutes }} 分钟 {{ seconds }} 秒</div>
</template>

<script>
export default {
    name: "CountDown",
    data() {
        return {
            countDownDate: new Date("May 31, 2023 23:59:59").getTime(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };
    },
    mounted() {
        // 每一秒更新倒计时
        setInterval(() => {
            // 获取当前时间
            const now = new Date().getTime();

            // 计算时间差
            const distance = this.countDownDate - now;

            // 计算天数，小时数，分钟数和秒数
            this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
            this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        }, 1000);
    }
};
</script>


<style scoped>

</style>