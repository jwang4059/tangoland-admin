import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
	root: {
		minHeight: "100vh",
		display: "flex",
		flexDirection: "column",
		alignItems: "stretch",
		textAlign: "center",
	},
	card: {
		padding: "1rem",
		margin: "4rem 0",
	},
	title: {
		fontSize: "1.5rem",
		lineHeight: "2rem",
		padding: "1rem",
	},
	textfield: {
		margin: "1rem 0",
	},
});

const App = () => {
	const classes = useStyles();
	const [state, setState] = useState({
		expression: "",
		kana: "",
		romaji: "",
		meaning: "",
	});
	const [error, setError] = useState(false);

	const canAdd = Object.values(state).every(Boolean);

	const addToDb = async () => {
		try {
			const response = await fetch("localhost:3001/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(state),
			});
			const data = await response.json();

			return data;
		} catch (e) {
			console.log(e);
		}
	};

	const handleInputChange = (event) => {
		setState({ ...state, [event.target.name]: event.target.value });

		const code = event.keyCode ? event.keyCode : event.which;
		if (code === 13) {
			handleSubmit();
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(state);

		if (!canAdd) {
			setError(true);
		} else {
			setState({
				expression: "",
				kana: "",
				romaji: "",
				meaning: "",
			});
			setError(false);
		}
	};

	return (
		<Container className={classes.root} maxWidth="xs">
			<Card className={classes.card}>
				<form noValidate autoComplete="off">
					<Typography className={classes.title} component="h1">
						TangoLand Admin
					</Typography>
					<TextField
						className={classes.textfield}
						id="expression"
						name="expression"
						value={state.expression}
						error={error && !Boolean(state.expression)}
						label="Expression"
						variant="outlined"
						fullWidth
						required
						autoFocus
						onChange={handleInputChange}
					/>
					<TextField
						className={classes.textfield}
						id="kana"
						name="kana"
						value={state.kana}
						error={error && !Boolean(state.kana)}
						label="Kana"
						variant="outlined"
						fullWidth
						required
						onChange={handleInputChange}
					/>
					<TextField
						className={classes.textfield}
						id="romaji"
						name="romaji"
						value={state["romaji"]}
						error={error && !Boolean(state.romaji)}
						label="Romaji"
						variant="outlined"
						fullWidth
						required
						onChange={handleInputChange}
					/>
					<TextField
						className={classes.textfield}
						id="meaning"
						name="meaning"
						value={state.meaning}
						error={error && !Boolean(state.meaning)}
						label="Meaning"
						variant="outlined"
						fullWidth
						required
						onChange={handleInputChange}
					/>
					<br />
					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						onClick={handleSubmit}
					>
						Submit
					</Button>
				</form>
			</Card>
		</Container>
	);
};

export default App;
