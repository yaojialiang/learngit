<template>
	<div class="app-viewa warp_bg bg_static">
		<div class="warp_mins">
			<div class="w-futures">
				<h3 class="h3_title"> <i class="icons_min2 im1"></i> 期货行情</h3>
				<el-form  label-width="102px">
					<el-form-item label="期货中心：">
						<el-radio-group v-model="radio">
							<el-radio-button @click.native="shExchange()" label="上海期货交易所" style="border-left:none"></el-radio-button>
							<el-radio-button @click.native="dlExchange()" label="大连商品交易所"></el-radio-button>
							<el-radio-button @click.native="czExchange()" label="郑州商品交易所"></el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<el-form  label-width="102px">
					<el-form-item label="期货品种：">
						<el-button v-for="(value,index) in dataset" @click.native="qhCategory(value,index)" :label="value" :class="{show:index==isActive}" :key="index">{{value.head}}</el-button>
					</el-form-item>
				</el-form>
				<el-table :data="futruesAll" border style="width: 100%;text-align:center;">
					<el-table-column label="合约">
						<template slot-scope="scope">
							<router-link :to="{path:'futuresdetaill', query:{contractCode:scope.row.contractCode,contractName:scope.row.contractName}}" >
								{{scope.row.contractName}}
							</router-link>
						</template>
					</el-table-column>
					<el-table-column label="最新价">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.lastPrice}}</span>
						</template>
					</el-table-column>
					<el-table-column label="开盘价">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.openPrice}}</span>
						</template>
					</el-table-column>
					<el-table-column label="涨跌">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.change}}</span>
						</template>
					</el-table-column>
					<el-table-column label="涨跌幅">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.chg}}</span>
						</template>
					</el-table-column>
					<el-table-column label="最高价">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.highestPrice}}</span>
						</template>
					</el-table-column>
					<el-table-column label="最低价">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.lowestPrice}}</span>
						</template>
					</el-table-column>
					<el-table-column label="买入价">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.bidPrice1}}</span>
						</template>
					</el-table-column>
					<el-table-column label="卖出价">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.askPrice1}}</span>
						</template>
					</el-table-column>
					<el-table-column label="昨结算价">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.preSettlementPrice}}</span>
						</template>
					</el-table-column>
					<el-table-column label="买量">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.bidVolumn1}}</span>
						</template>
					</el-table-column>
					<el-table-column label="卖量">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.askVolumn1}}</span>
						</template>
					</el-table-column>
					<el-table-column label="成交量">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.volumn}}</span>
						</template>
					</el-table-column>
					<el-table-column label="持仓量">
						<template slot-scope="scope">
							<span :class="[(scope.row.value.change == 0 ? 'cash-ping' : (scope.row.value.change > 0 ? 'cash-amount' : 'cash-down'))]">{{scope.row.value.openInterest}}</span>
						</template>
					</el-table-column>
					<el-table-column label="加自选">
						<template slot-scope="scope">
							<span @click="text666(scope.row); " style="display:block; height:24px;"><i class="el-icon-plus"></i></span>
							<el-dialog title="加自选" :visible.sync="centerDialogVisible" width="24%" center>
								<p style="text-align:center; font-size:16px; height:45px; line-height:45px;">是否将<span style="font-size:16px;" :class="[(freeChoiceChange == 0 ? 'cash-ping' : (freeChoiceChange > 0 ? 'cash-amount' : 'cash-down'))]">{{freeChoice.contractName}}</span>加入自选合约</p>
								<span slot="footer" class="dialog-footer">
									<el-button @click="centerDialogVisible = false" style="font-size:16px;">取 消</el-button>
									<el-button type="primary" @click="applyfreeChoice()" style="font-size:16px;">确 定</el-button>
								</span>
							</el-dialog>
						</template>	
					</el-table-column>
					<el-table-column label="设预警">
						<template slot-scope="scope">
							<span @click="text777(scope.row); " style="display:block; height:24px;"><i class="el-icon-bell"></i></span>
							<el-dialog title="设置价格预警" :visible.sync="centerDialogVisible2" width="24%" center>
								<el-form label-position="right">
									<el-form-item label='合约：'>
										<span style="font-size:16px; " :class="[(freeChoiceChange == 0 ? 'cash-ping' : (freeChoiceChange > 0 ? 'cash-amount' : 'cash-down'))]">{{freeChoice.contractName}}</span>
									</el-form-item>
									<el-form-item label='预设价格上限：'>
										<el-input v-model="highest" style="width:50%;"><template slot="append">元</template></el-input>
									</el-form-item>
									<el-form-item label='预设价格下限：'>
										<el-input v-model="lowest" style="width:50%;"><template slot="append">元</template></el-input>
									</el-form-item>
								</el-form>
								<span slot="footer" class="dialog-footer">
									<el-button @click="centerDialogVisible2 = false" style="font-size:16px;">取 消</el-button>
									<el-button type="primary" @click="applywarning()" style="font-size:16px;">确 定</el-button>
								</span>
							</el-dialog>
						</template>	
					</el-table-column>
				</el-table>
			</div>

		</div>
	</div>
</template>

<script>
	import { mapState, mapActions} from 'vuex'
	import $bus from '@/util/global-bus'
	import iData from '@/util/iData'
	import uniq from 'lodash/uniq'

	let numRE = /^[1-9]\d*$/;
	export default {
		name: 'spot-mall',
		data() {
			return {
				radio: '上海期货交易所',
				btncolor: 'show',
				isActive:0,
				datalist:[],
				dataset:[],
				tableData:[],
				goodsData: [],
				pageMeta: {},
				contractPrice: {},
				currentCode: '', // 当前合约
				currentPrice: {
					lastPrice: '',
					bidPrice1: '',
					askPrice1: '',
					openInterest: '',
					bidVolumn1: '',
					askVolumn1: '',
					upperLimitPrice: '',
					lowerLimitPrice: ''
				},
				ttCodes:[],
				DJprice: 0,
				futruesAll:[],
				tableDataAll:[],

				centerDialogVisible: false,
				centerDialogVisible2: false,
				freeChoice: '',
				freeChoiceChange: '',

				highest: '', //价格预警上限
				lowest: '' //价格预警下限
			}
		},
		computed: {
		...mapState(['auth'])
		},
		async mounted() {
			let code = ''
			let user = iData.get('authInfo')
			if(user) {
				this.refresh()
				code = user.userCode
			} else {
				code = ~~(Math.random()*1000+1)
			}

			let futures = await this.$axios.post('/contract/exchange/list');
			this.shExchange();
		},
		methods: {
			...mapActions(['refresh']),
			moment: moment,
			//手动断开socket连接
			beforeDestroy () {
				// socketMd.close()
				// socketService.close()
				// $bus.$off('recive:md')
				// $bus.$off('recive:md')
				// console.log(10010)
				// $bus.$on('msg:product', () => {
				// 	console.log(10086)
				// 	$off()
				// })
			},
			cc(code) {
				return code ? code.toLowerCase() : null
			},
			async shExchange(){
				this.tableData = [];
				let futures = await this.$axios.post('/contract/exchange',{"exchange":"SHFE"});
				this.dataset = futures.data.returnObject.data;
				this.qhCategory( this.dataset[0],0 )
			},
			async dlExchange(){
				this.tableData = [];
				let futures = await this.$axios.post('/contract/exchange',{"exchange":"DCE"});
				this.dataset = futures.data.returnObject.data;
				this.qhCategory( this.dataset[0],0 )
			},
			async czExchange(){
				this.tableData = [];
				let futures = await this.$axios.post('/contract/exchange',{"exchange":"CZCE"});
				this.dataset = futures.data.returnObject.data;
				this.qhCategory( this.dataset[0],0 )
			},
			qhCategory(value,index){
				this.futruesAll = [];
				let goodsData = [];
				let goods = [];
				// let contractMap = new Map();
				let contractCodes = value.contracts
				for (let item of contractCodes) {
					let data = {};
					goods.push(item.contractCode);
					data.contractName = item.contractName;
					data.contractCode = item.contractCode;
					data.value = '';
					goodsData.push(data);
				}
				$bus.$on('recive:md', data => {
					goodsData.find((obj) => {
						let contractCode = obj.contractCode.toLowerCase();
						if(contractCode === data.instrumentId){
							obj.value = data;
						}
					})  
					this.futruesAll = goodsData;
				})
				if($bus.inited) {
					$bus.$emit('md:send', {
						instuementIds: goods
					})
				} else {
					$bus.$on('md:init', () => {
						console.log('init')
						$bus.$emit('md:send', {
							instuementIds: goods
						})
					})
				}
				this.isActive=index;
				
			},
			listenSocketMsg() {
				$bus.$on('msg:product', () => {
					this.qhCategory()
				})
			},
			text666(value){
				this.freeChoice = value
				this.freeChoiceChange = this.freeChoice.value.change
				this.centerDialogVisible = true
			},
			async applyfreeChoice(){
				try{
					let freeChoiceCode = []
					let applyfreeChoices = this.freeChoice.contractCode
					freeChoiceCode.push(applyfreeChoices)
					let {data: res} = await this.$axios.post('/user/contract/save', {
						contractCodes: freeChoiceCode
					})
					this.centerDialogVisible = false
					this.$message.success('加入自选成功')
				} catch (error) {this.showErrorMsg(error)}
			},
			text777(value){
				this.freeChoice = value
				this.freeChoiceChange = this.freeChoice.value.change
				this.currentPrice.lastPrice = this.freeChoice.value.lastPrice
				this.centerDialogVisible2 = true
			},
			async applywarning(){
				if(this.highest === '' && this.lowest === ''){
					this.$message.warning('请输入预警价格上限或下限！')
					return;
				}
				// if(this.highest > this.currentPrice.lastPrice || this.lowest < this.currentPrice.lastPrice){}
				if(!numRE.test(this.highest)){
					this.$message.warning('上限价格应为大于零的整数！')
					return;
				}
				if(!numRE.test(this.lowest)){
					this.$message.warning('下限价格应为大于零的整数！')
					return;
				}
				if(this.highest < this.currentPrice.lastPrice){
					this.$message.warning('当前最新价已达到预警价格上限，请重新设置！')
					return;
				}else if(this.lowest > this.currentPrice.lastPrice){
					this.$message.warning('当前最新价已达到预警价格下限，请重新设置！')
					return;
				}else{
					try{
						let {data: res} = await this.$axios.post('/contract/priceAlert/save', {
							contractCode: this.freeChoice.contractCode,
							highest: this.highest,
							lowest: this.lowest
						})
						this.centerDialogVisible2 = false
						this.$message.success('加入预警成功')
					} catch (error) {this.showErrorMsg(error)}
				}
			}
		},
		// created(){
		// 	this.qhCategory()
		// 	//console.log('is-inited', $bus.inited)
		// }
	}
</script>

<style lang="scss" scoped>
	.warp_mins{
		width: 1300px;
		height: 100%;
		margin:0 auto;
		background: #fff;
		.cash-amount {
			font-size: 14px;
			@extend .color-r;
		}
		.cash-down {
			font-size: 14px;
			@extend .color-g;
		}
		.cash-ping {
			font-size: 14px;
			@extend .color-b;
		}
		.color-r {
			color: #e7505a;
		}
		.color-g {
			color: #30c675;
		}
		.color-b {
			color: #222222;
		}
	}
	.w-futures{
		.h3_title{
			margin: 20px;
    		display: inline-block;
		}
		.h4_title{
			margin: 20px;
			float:left;
			display: inline-block;
		}
		.el-table{
			text-align: center;
			i{
				font-size: 22px;
				color: #929EFE;
			}
		}
		.el-table th.is-leaf{
			text-align: center;
		}
		.el-radio-button{
			margin-right: 20px;
			border-left: 1px solid #dcdfe6;
		}
		.show{
			background: #4D65FD;
			color: #fff;
		}
	}
</style>

