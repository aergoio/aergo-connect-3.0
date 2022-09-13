<template>
	<ScrollView class="page">
		<Appear>
			<Header :skip="true" title="Register Account" />
			<div class="register-contents">
				<Heading class="big-title">Register an Account</Heading>
				<span class="pre-header"
					>Import on existing accounts or create a new one.</span
				>
				<img src="@/assets/img/logo-circle.svg" alt="logo" width="120px" />
			</div>
			<div class="content">
				<Appear :delay="0.6">
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
						<Button
							type="primary"
							:disabled="true"
							size="large"
							:to="{ name: 'setup', params: { next: 'account-import' } }"
						>
							Connect Ledger
						</Button>
					</ButtonGroup>
				</Appear>
			</div>
		</Appear>

		<template #footer>
			<!-- <div class="content">
				<Appear :delay="0.6">
					<ButtonGroup vertical>
						<Button
							type="primary-outline"
							size="large"
							:to="{ name: 'setup', params: { next: 'account-import' } }"
							>Import your wallet</Button
						>
						<Button
							type="primary"
							size="large"
							:to="{ name: 'setup', params: { next: 'account-create' } }"
							>Create new wallet</Button
						>
						<Button
							type="secondary"
							size="large"
							:to="{ name: 'setup', params: { next: 'account-import' } }"
							>Import your wallet</Button
						>
					</ButtonGroup>
				</Appear>
			</div> -->
		</template>
	</ScrollView>
</template>

<script lang="ts">
import { Header, ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import Appear from '@aergo-connect/lib-ui/src/animations/Appear.vue';
import Component, { mixins } from 'vue-class-component';
import { PersistInputsMixin } from '../../store/ui';

@Component({
	components: {
		ScrollView,
		Button,
		ButtonGroup,
		Heading,
		Appear,
		Header,
	},
})
export default class Create extends mixins(PersistInputsMixin) {
	chainId = 'aergo.io';
	persistFields = ['chainId'];
	options = [
		['aergo.io', 'Mainnet'],
		['testnet.aergo.io', 'Testnet'],
	];

	async create() {
		const {
			account,
			mnemonic,
		} = await this.$background.createAccountWithMnemonic({
			chainId: this.chainId,
		});
		console.log(account, mnemonic);
		console.log('cretae clicked');
		// this.$store.commit('accounts/setSeedPhrase', mnemonic);
		// this.$router.push({
		// 	name: 'account-created',
		// 	params: {
		// 		chainId: account.chainId,
		// 		address: account.address,
		// 	},
		// });
	}
}
</script>

<style lang="scss">
.register-contents {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 32px;
	margin-bottom: 84px;
	.pre-header {
		font-size: 16px;
		line-height: 20px;
		text-align: center;
		letter-spacing: -0.333333px;
		color: #686767;
		inline-size: 230px;
		overflow-wrap: break-word;
		margin-bottom: 32px;
	}
}
</style>
