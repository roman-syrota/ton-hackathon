<template>
  <div>
      <div id="app">
        <div id="ton-connect"></div>
        <div class="ton-connect-button">
        </div>
        <Quiz class="quiz-container" />
      </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import * as TON_CONNECT_UI from "@tonconnect/ui";
import Quiz from './components/Quiz.vue';

const currentWallet = ref()
const currentWalletInfo = ref()
const currentAccount = ref()
const currentIsConnectedStatus = ref()

onMounted(() => {
  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://dev-new.itispay.com/storage/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
  });

  const subscribe = tonConnectUI.onStatusChange(
      walletAndwalletInfo => {
        currentWallet.value = tonConnectUI.wallet;
        currentWalletInfo.value = tonConnectUI.walletInfo;
        currentAccount.value = tonConnectUI.account;
        currentIsConnectedStatus.value = tonConnectUI.connected;

        localStorage.setItem('currentWallet', currentWallet.value)
        localStorage.setItem('currentWalletInfo', currentWalletInfo.value)
        localStorage.setItem('currentAccount', currentAccount.value)
        localStorage.setItem('currentIsConnectedStatus', currentIsConnectedStatus.value)
      }
  );
})


</script>

<style lang="scss">
@import 'normalize-scss';
@include normalize();

html {
  line-height: 1.5;
}
h1 {
  font-size: 3em;
  font-style: italic;
}
h2 {
  font-size: 1.75rem;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.button {
  min-width: 140px;
  padding: 1.25rem 2rem;
  font-family: -system-ui, sans-serif;
  font-size: 1.125rem;
  line-height: 1.2;
  color: #313030;
  background-color: $btn-bg;
  border: 0;
  border-radius: 1px;
  white-space: nowrap;
  text-decoration: none;
  text-transform: capitalize;
  transition: all 0.1s;
  cursor: pointer;
  &:hover {
    color: #fff;
    background-color: $btn-hover;
  }
  &[disabled] {
    color: #313030;
    background-color: #a9aaac;
    pointer-events: none;
  }
}
#app {
  display: flex;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2.5rem 0.625rem;
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #fff;
  background-color: #0e1324;
  letter-spacing: 0.5px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#ton-connect {
  position: absolute;
  top: 40px;
  right: 40px;
}
</style>
