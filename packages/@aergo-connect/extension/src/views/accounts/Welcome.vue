<template>
  <ScrollView class="page">
    <div class="welcome-content">
      <Appear>
        <Heading class="big-title">Welcome to</Heading>
        <div class="aergoMainLogo">
          <Icon name="aergoMainLogo" :size="150" />
          <div class="welcome-message-1-group">
            <span class="welcome-message-1">
              AERGO Connect is the official wallet of
            </span>
            <span class="welcome-message-1">AERGO Blockchain.</span>
          </div>
          <span class="welcome-message-2">
            The Blockchain For the WORLD.
          </span>
        </div>
      </Appear>
    </div>

    <template #footer>
      <div>
        <Appear :delay="0.6">
          <ButtonGroup vertical>
            <Button 
		type="primary" 
                size="large"
		:to="{ name: 'setup' }" 
		hover=true
            >Get Started</Button>
          </ButtonGroup>
        </Appear>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';

export default Vue.extend({
  components: {
    ScrollView,
    Button,
    ButtonGroup,
    Heading,
    Appear,
    Icon,
  },
});
</script>

<style lang="scss">
.welcome-content {
  margin-top: 90px;
}
.aergoMainLogo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  .welcome-message-1-group {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    font-family: 'Outfit';
    .welcome-message-1 {
      font-weight: 400;
      font-size: 1em;
    }
  }

  .welcome-message-2 {
    font-family: 'Outfit';
    margin-top: 20px;
    font-weight: 500;
    font-size: 1em;
  }
}
#app.page-welcome {
  background: linear-gradient(0deg, #ffffff -10.1%, #ecf8fd 58.85%, #fff1f9 139.14%);
}
</style>
