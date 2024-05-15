<template>
    <div class="container">
        <div class="login-wrapper">
            <div class="login-header">欢迎登录</div>
            <div class="form-wrapper">
                <a-form
                    :model="formData"
                    name="horizontal_login"
                    layout="horizontal"
                    autocomplete="off"
                    @finish="doLogin"
                >
                    <a-form-item
                        label="Username"
                        name="username"
                        :rules="[
                            {
                                required: true,
                                message: '请输入用户名',
                            },
                        ]"
                    >
                        <a-input v-model:value="formData.username">
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item
                        label="Password"
                        name="password"
                        :rules="[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]"
                    >
                        <a-input-password v-model:value="formData.password">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item>
                        <a-button
                            type="primary"
                            @click="login"
                            html-type="submit"
                        >
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, getCurrentInstance, onMounted } from "vue";

const that = getCurrentInstance().appContext.config.globalProperties;

interface FormData {
    username: string;
    password: string;
}
const formData = reactive<FormData>({
    username: "",
    password: "",
});

onMounted(() => {
    hasLogin();
});

const hasLogin = () => {
    that.$API({
        method: "GET",
        url: "/auth-api/auth/hasAuth",
    }).then(()=>{
        that.$router.back();
    })
};

const doLogin = () => {
    that.$API({
        method: "POST",
        url: "/auth-api/login",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        data: formData,
    }).then(()=>{
        that.$router.push("/");
    })
};
</script>
<style lang="less">
.container {
    height: 100%;
    background-image: radial-gradient(#ecba00, #f3d66b 60%);
}

.login-wrapper {
    background-color: #fff;
    width: 500px;
    height: 588px;
    border-radius: 15px;
    padding: 0 50px;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.login-header {
    font-size: 38px;
    font-weight: bold;
    text-align: center;
    line-height: 200px;
    color: #514310;
}

.input-item {
    display: block;
    width: 100%;
    margin-bottom: 20px;
    border: 0;
    padding: 10px;
    border-bottom: 1px solid rgb(128, 125, 125);
    font-size: 15px;
    outline: none;
}

.input-item:placeholder {
    text-transform: uppercase;
}

.btn {
    text-align: center;
    padding: 10px;
    width: 100%;
    margin-top: 40px;
    background-image: radial-gradient(#ecba00, #f3d66b 60%);
    color: #fff;
    cursor: pointer;
}

.msg {
    text-align: center;
    line-height: 88px;
}

a {
    text-decoration-line: none;
    color: #abc1ee;
}
</style>
