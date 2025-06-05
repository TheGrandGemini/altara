import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import style from '../UI/DisplayBalance/TokensBalance.module.css';

const BalanceSkeleton = () => (
	<table className={style.tokenTable}>
		<thead>
			<tr>
				<th>Chain</th>
				<th>Token</th>
				<th>Price</th>
				<th>Amount</th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody>
			{[...Array(5)].map((_, i) => (
				<tr key={i}>
					<td>
						<Skeleton
							width={80}
							height={24}
						/>
					</td>
					<td>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<Skeleton
								circle
								width={24}
								height={24}
							/>
							<Skeleton
								width={90}
								height={20}
							/>
						</div>
					</td>
					<td>
						<Skeleton
							width={60}
							height={24}
						/>
					</td>
					<td>
						<Skeleton
							width={60}
							height={24}
						/>
					</td>
					<td>
						<Skeleton
							width={80}
							height={24}
						/>
					</td>
				</tr>
			))}
		</tbody>
	</table>
);

export default BalanceSkeleton;
