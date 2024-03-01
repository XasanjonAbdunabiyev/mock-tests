import { API_COLLECTIONS } from '@/services/api/api-collection'
import {
	addUsersToUsersDatabase,
	getFirestoreCollections,
} from '@/services/api/docs'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
	Paper,
	PasswordInput,
	TextInput,
	Title,
	Button,
	Text,
} from '@mantine/core'

import { notifications } from '@mantine/notifications'
import { ROUTER_ACTIONS } from '@/services/providers/Router/RouterActions'
import { v4 as uuid } from 'uuid'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import classes from './style.module.scss'

const SignInSchema = z.object({
	username: z.string().nonempty('Username is required').min(3).max(10),
	email: z
		.string()
		.nonempty('Email is a required')
		.min(7)
		.email('Email format is not valid'),

	password: z.string().nonempty('Password is required'),
})

export default function SignInScreen() {
	const { data: admin } = useQuery({
		queryKey: ['admin-data'],
		queryFn: async () => {
			const res = getFirestoreCollections(API_COLLECTIONS.LOGIN)
			try {
				return res
			} catch (error) {
				throw new Error('Failed to fetch admin data')
			}
		},
	})

	const navigate = useNavigate()

	const form = useForm({
		resolver: zodResolver(SignInSchema),
	})

	const { register, handleSubmit, formState } = form
	const { errors, isSubmitting, isSubmitSuccessful } = formState

	const onSubmit = async (data) => {
		try {
			let adminEmail = admin?.[0]?.email
			let adminPassword = admin?.[0]?.password
			if (
				adminEmail === data?.email &&
				adminPassword === data?.password
			) {
				navigate(ROUTER_ACTIONS.DASHBOARD)
				localStorage.setItem('token', `${uuid()}`)
				notifications.show({
					title: 'Welcome to Dashboard',
					message: 'Your are admin',
				})
			} else {
				await addUsersToUsersDatabase(data?.email, data?.password).then(
					() => {
						navigate(ROUTER_ACTIONS.HOME)
						notifications.show({
							title: 'Account Created',
							message: 'Your account has been created',
							autoClose: 3000,
						})
					}
				)
			}
		} catch (error) {
			notifications.show({
				title: 'Something went wrong',
				autoClose: 2000,
			})
		}
	}

	return (
		<div className={classes.wrapper}>
			<Paper className={classes.form} radius={0} p={30}>
				<form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
					<Title
						order={2}
						className={classes.title}
						ta="center"
						mt="md"
						mb={50}
					>
						Welcome to{' '}
						<Text
							component="a"
							variant="gradient"
							size='xl'
							my={2}
							href='/'
							td="underline"
							fw="bold"
							display="block"
						>
							Multi Level Mock Tests
						</Text>
					</Title>

					<TextInput
						label="Username"
						placeholder="someone"
						size="md"
						{...register('username')}
					/>

					{errors.username && (
						<Text color="red" fw="bold">
							{errors.username.message}
						</Text>
					)}

					<TextInput
						label="Email address"
						placeholder="hello@gmail.com"
						size="md"
						{...register('email')}
					/>

					{errors.email && (
						<Text color="red" fw="bold">
							{errors.email.message}
						</Text>
					)}

					<PasswordInput
						label="Password"
						placeholder="Your password"
						mt="md"
						size="md"
						{...register('password')}
					/>

					{errors.password && (
						<Text color="red" fw="bold">
							{errors.password.message}
						</Text>
					)}

					<Button
						fullWidth
						mt="xl"
						loaderProps={{ type: 'bars' }}
						disabled={isSubmitSuccessful}
						loading={isSubmitting}
						variant="filled"
						type="submit"
						size="md"
					>
						Sign In
					</Button>
					<Button
						fullWidth
						mt="sm"
						size="md"
						tt="uppercase"
						type="reset"
						bg="red"
					>
						Reset Changes
					</Button>
				</form>
			</Paper>
		</div>
	)
}
