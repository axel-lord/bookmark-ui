// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs::File,
    io::{self, BufReader},
};

use native_dialog::FileDialog;
use serde::Serialize;
use tap::Pipe;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    #[error(transparent)]
    FileDialog(#[from] native_dialog::Error),
    #[error("no file was chosen using dialog")]
    NoFileChosen,
    #[error(transparent)]
    BookmarkData(#[from] bookmark_data::Error),
    #[error(transparent)]
    Io(#[from] io::Error),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[tauri::command]
async fn open_bookmark_file() -> Result<bookmark_data::Data, Error> {
    FileDialog::new()
        .show_open_single_file()?
        .ok_or(Error::NoFileChosen)?
        .pipe(File::open)?
        .pipe(BufReader::new)
        .pipe(bookmark_data::Data::load)?
        .pipe(Ok)
}

#[tauri::command]
async fn open_in_browser(link: String) -> Result<(), Error> {
    open::that(link)?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_bookmark_file,
            open_in_browser
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
