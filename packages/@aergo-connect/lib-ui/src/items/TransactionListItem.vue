<template>
  <div class="transaction__list__item__wrapper sent">
    <div class="item__summary">
      <div class="time__stamp">
        <span>2022.03.08 22:56</span>
      </div>
      <div class="transaction__sum">
        <span class="action sent">Received</span>
        <div class="transaction__amount">
          <span class="amount">525.000</span>
          <span class="token__name">ARG</span>
        </div>
      </div>
    </div>
    <hr />
    <div class="item__from">
      <span>From: AmLx...e42f</span>
      <div class="icon__container">
        <img src="../icons/img/go-to-detail-transaction.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
export default Vue.extend({
  props: {},
  data() {
    return {
      status: (null as unknown) as string,
      timeStamp: "",
      amount: "",
      token: "",
      from: "",
    };
  },
  computed: {},
  methods: {},
});
</script>

<style lang="scss">
@import "../styles/variables";

.transaction__list__item__wrapper {
  width: 327px;
  height: 88px;
  background: #ffffff;
  border-radius: 8px;
  padding: 0px 16px;

  .item__summary {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;

    .time__stamp {
      display: flex;
      padding-top: 8px;
      span:first-child {
        font-size: 13px;
        line-height: 15px;
        color: #9c9a9a;
      }
    }

    .transaction__sum {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      font-weight: 500;
      font-size: 17px;
      line-height: 21px;
      color: #454344;

      .action {
        font-weight: 500;
        font-size: 17px;
        line-height: 21px;
        color: #279ecc;

        &.sent {
          color: #454344;
        }
      }

      .transaction__amount {
        span {
          color: #454344;
        }
        .token__name {
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
        }
      }
    }
  }

  hr {
    border: 1px solid #eff5f7;
  }
}

.item__from {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 6px;

  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-decoration-line: underline;
    color: #686767;
  }
  .icon__container {
    width: 22px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    border: 1px solid #eff5f7;
    box-shadow: 0px 2px 5px rgba(142, 163, 171, 0.15);
    border-radius: 4px;
    cursor: pointer;
    img {
      margin-right: 2px;
    }
  }
}
</style>
