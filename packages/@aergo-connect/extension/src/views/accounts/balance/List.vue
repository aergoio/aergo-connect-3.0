<template>
	<div class="balance-list-view">
		<ScrollView>
			<template #header>
				<div class="balance-list-header">
					<BackButton :to="{ name: 'accounts-list' }" />
					<Heading tag="h2">
						My Wallet
					</Heading>
				</div>
			</template>
			<div class="balance-list-wrap">
				<AccountBalanceList
					:address="accountSpec.address"
					:chainId="accountSpec.chainId"
					:canDelete="true"
				/>
			</div>
			<template #footer>
				<div class="footer-content">
					<div class="balance-footer-wrap">
						<span>Don't see your token?</span>
						<Button type="secondary" style="color: blue">Add token</Button>
					</div>
				</div>
			</template>
		</ScrollView>
	</div>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import AccountBalanceList from '../../../components/accounts/AccountBalanceList.vue';
import { Button, BackButton } from '@aergo-connect/lib-ui/src/buttons';

import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
	components: {
		ScrollView,
		Heading,
		Button,
		BackButton,
		Icon,
		AccountBalanceList,
	},
})
export default class BalanceList extends Vue {
	state: 'initial' | 'loading' | 'loaded' | 'error' = 'initial';

	get accountSpec() {
		return {
			address: this.$route.params.address,
			chainId: this.$route.params.chainId,
		};
	}
}
</script>

<style lang="scss">
.balance-list-view {
	height: 100%;
	box-sizing: border-box;
}
.balance-list-header {
	border-bottom: 1px solid #f2f2f2;
	padding: 0 20px;
}
.balance-list-wrap {
	border-radius: 2px;
	box-shadow: 0 12px 20px 0 rgba(34, 34, 34, 0.08);
	margin: 20px 20px 25px 20px;
}
.balance-footer-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
