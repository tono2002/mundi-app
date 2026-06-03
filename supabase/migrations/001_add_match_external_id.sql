-- Migration 001: add external_id to matches for daily sync upserts
alter table matches add column if not exists external_id text unique;
