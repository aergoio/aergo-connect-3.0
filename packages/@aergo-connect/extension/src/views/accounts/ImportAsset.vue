<template>
  <ScrollView orientation="horizontal">
    <Header button="back" title="Import Asset" @backClick="handleBack" />
    <div class="tab_content">
      <div class="tab_wrapper">
        <div class="tab_active">
          <div class="tab_text">Search</div>
          <div class="tab_line" />
        </div>
        <div class="tab_disable">
          <div class="tab_text">Custom</div>
          <div class="tab_line" />
        </div>
      </div>

      <div class="search_wrapper">
        <div class="network_wrapper">
          <div class="network_circle" />
          <div class="network_text">{{ network() }}</div>
        </div>
        <TextField class="network_textField" @submit="search"/>
        <ul class="select_token_content">
          <div v-if="results.length">
            <p> NAME           SYMBOL </p>
            <ul >
              <li v-for="result in results" class="select_token_list" @click="select(result)">
                  <Identicon :text="result.hash" class="list_icon" />
                  <span class="list_text">
                    {{ result.meta.name + "    " + result.meta.symbol }} 
                  </span>
                  <span class="list_button">
                    {{ result.meta.type }} 
                  </span>
              </li>
            </ul>
          </div>
        </ul>
      </div>
    </div>
    <template #footer>
      <Button type="primary" size="large">Import</Button>
    </template>
  </ScrollView>
</template>

<script>
import Vue from 'vue';
import Header from '@aergo-connect/lib-ui/src/layouts/Header.vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import TextField from '@aergo-connect/lib-ui/src/forms/TextField.vue';
import Button from '@aergo-connect/lib-ui/src/buttons/Button.vue';
import Identicon from '../../../../lib-ui/src/content/Identicon.vue';

export default Vue.extend({

  components: { 
    Header, 
    ScrollView, 
    TextField, 
    Button,
    Identicon,
  },

  data() {
    return {
      results: {},
    }
  },

  methods: {
    handleBack() {
      this.$router.push({ 
        name: 'accounts-list-address', 
        params: {
          address: this.$route.params.address,
        }
      });
    },

    async search(query) {
      console.log("Search", query) ;
      await fetch(`https://api.aergoscan.io/${this.network()}/v2/token?q=*${query}*`).then(res => {
            return res.json()
        }).then(data => {
          this.results = data.hits ;
        });
        
       console.log("Results", this.results) ;
    },
    
    async select(token) {
      console.log("Selected",token.meta) ;
      this.addToken(this.$route.params.address, token) ;
        
      this.$router.push({ 
        name: 'accounts-list-address', 
        params: {
          address: this.$route.params.address,
        }
      })
    },

    async addToken(address, token) {
      const key = address.substr(0,5) + "_" + this.network() + "_token" ;
      const tokensJ = localStorage.getItem(key) ;

      var tokens = [] ;
      if (tokensJ) {
        tokens = JSON.parse(tokensJ);
      }
      tokens.push(token) ;
      localStorage.setItem(key,JSON.stringify(tokens)) ;
      console.log("tokens", tokens) ;
    },

    network() {
      const network = localStorage.getItem('Network') ;
      if (!network) network = 'aergo.io' ;
      return network ;
    }
  }
});

</script>

<style lang="scss">
.tab_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  .tab_wrapper {
    width: 375px;
    height: 35px;
    display: flex;
    .tab_active {
      height: 35px;
      .tab_text {
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 7px;
        color: #279ecc;
      }
      .tab_line {
        width: 187px;
        align-items: flex-start;
        border: 2px solid #279ecc;
      }
    }
    .tab_disable {
      .tab_text {
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 7px;
        color: #9c9a9a;
      }
      .tab_line {
        width: 187px;
        color: #9c9a9a;
        border: 1px solid #f0f0f0;
      }
    }
  }
  .search_wrapper {
    width: 327px;
    height: 48px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    .network_wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .network_circle {
        border-radius: 50%;
        background: #e4097d;
        width: 6px;
        height: 6px;
        margin-right: 2px;
      }
      .network_text {
        color: #686767;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 16px;
        text-align: center;
        letter-spacing: -0.333333px;
      }
      .network_textField {
        width: 327px;
        height: 48px;
        border-radius: 4px;
      }
    }
  }

  .select_token_content {
    width: 327px;
    margin-top: 35px;
    .select_token_text {
      font-family: 'Outfit';
      font-style: normal;
      font-weight: 300;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: -0.333333px;

      /* Grey/06 */

      color: #686767;
    }
    .select_token_list {
      width: 327px;
      height: 62px;
      display: flex;
      align-items: center;
      .list_icon {
        width: 40px;
        height: 40px;
        margin-left: 24px;
        align-items: center;
      }
      .list_text {
        display: flex;
        /* Subtitle/S3 */
        width: 250px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: -0.333333px;
        margin-left: 12px;
        /* Grey/07 */

        color: #454344;
      }
      .list_button {
        margin-left: 100px;
        font-family: 'Outfit';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        /* identical to box height */

        text-align: right;
        letter-spacing: -0.333333px;

        /* Primary/Blue02 */

        color: #84ceeb;
      }
    }
  }
}
</style>
