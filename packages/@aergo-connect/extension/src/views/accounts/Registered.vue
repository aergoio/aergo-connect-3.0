<template>
	<ScrollView>
		<img src="../../assets/img/dummy-logo.svg" alt="" />
		<Heading class="big-title">Registered Account!</Heading>

		<div>
			<span>Address</span>
			<div>
				<span>AmNx7zKkcrzd2hA9TBKhrs446DM1zYYSNcAHfhfKXkKtE6FCvSYAW</span>
			</div>
		</div>

		<div>
			<div>
				<span>Nickname</span>
				<!-- <img src="@aergo-connect/lib-ui/src/icons/img/edit.svg" alt="" /> -->
				<div>
					<span>ACCOUNT 1</span>
				</div>
			</div>
		</div>
		<ButtonGroup vertical>
			<Button
				type="primary-outline"
				size="large"
				:to="{ name: 'setup', params: { next: 'account-import' } }"
			>
				Import
			</Button>
			<Button @click="create" type="primary" size="large">
				Create
			</Button>
		</ButtonGroup>
	</ScrollView>
</template>

<scritp lang="ts">
  import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
  import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
  import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';
  import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
  import SelectField from '@aergo-connect/lib-ui/src/forms/SelectField.vue';
  import { PersistInputsMixin } from '../packages/@aergo-connect/extension/src/store/ui';
  import SelectNetwork from '../packages/@aergo-connect/extension/src/components/accounts/SelectNetwork.vue';
  import Component, { mixins } from 'vue-class-component'


  import Component, { mixins } from 'vue-class-component';

  export default {
    components: {
      ScrollView,
      Heading,
      ButtonGroup,
      Button,
      
    }
  }

  </scritp>

<style lang="scss"></style>
