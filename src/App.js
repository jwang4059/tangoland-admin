import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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
	const [formState, setFormState] = useState({
		expression: "",
		kana: "",
		romaji: "",
		meaning: "",
	});
	const [snackbar, setSnackbar] = React.useState({
		open: false,
		message: "",
	});
	const [error, setError] = useState(false);

	const canAdd = Object.values(formState).every(Boolean);

	const addToDb = async () => {
		const response = await fetch("https://tangoland-api.herokuapp.com/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formState),
		});
		const data = await response.json();

		return data;
	};

	const handleInputChange = (event) => {
		setFormState({ ...formState, [event.target.name]: event.target.value });

		const code = event.keyCode ? event.keyCode : event.which;
		if (code === 13) {
			handleSubmit();
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log(formState);

		if (!canAdd) {
			setError(true);
			return;
		}

		try {
			const result = await addToDb();
			if (result.status === "success") {
				setFormState({
					expression: "",
					kana: "",
					romaji: "",
					meaning: "",
				});
				setError(false);
				setSnackbar({ open: true, message: "Successfully added" });
			} else {
				setSnackbar({
					open: true,
					message: `Error: ${result.message ? result.message : "Unknown"}`,
				});
			}
		} catch (e) {
			setSnackbar({
				open: true,
				message: `Error: ${e}`,
			});
		}
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setSnackbar({ ...snackbar, open: false });
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
						value={formState.expression}
						error={error && !Boolean(formState.expression)}
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
						value={formState.kana}
						error={error && !Boolean(formState.kana)}
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
						value={formState["romaji"]}
						error={error && !Boolean(formState.romaji)}
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
						value={formState.meaning}
						error={error && !Boolean(formState.meaning)}
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
					<Snackbar
						open={snackbar.open}
						autoHideDuration={6000}
						onClose={handleCloseSnackbar}
						message={snackbar.message}
						action={
							<IconButton
								size="small"
								aria-label="close"
								color="inherit"
								onClick={handleCloseSnackbar}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						}
					/>
				</form>
			</Card>
		</Container>
	);
};

export default App;
