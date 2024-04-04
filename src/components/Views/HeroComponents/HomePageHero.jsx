import { Container, Title } from '@mantine/core'
import classes from './style.module.scss'

export function HeroImageRight() {
	return (
		<div className={classes.root}>
			<Container size="lg">
				<div className={classes.inner}>
					<div className={classes.content}>
						<h1 className={classes.title}>
							Test Online, Anytime, Anywhere Multi Level English
							Test
						</h1>
					</div>
				</div>
			</Container>
		</div>
	)
}
