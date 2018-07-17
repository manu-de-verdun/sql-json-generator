# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.15.1] - 2018-07-17

### Bug

- Problem when using comparison operators with 0

- Compatiblity with prestoDB syntax (only tested for few select statemets)

## [0.15.0] - 2018-04-11

### Added

- Compatiblity with prestoDB syntax (only tested for few select statemets)

## [0.14.0] - 2018-02-22

### Added

- `$groupConcat` feature for SELECT Statements

## [0.13.0] - 2018-01-24

### Added

- Compatiblity with PostgreSQL syntax (only tested for few select statemets)

## [0.12.0] - 2017-12-18

### Added

- `$upper` feature for SELECT Statements
- `$lower` feature for SELECT Statements
- `$function` feature for SELECT Statements

## [0.11.1] - 2017-03-20

### Added

- `HAVING` HAVING operation
- `$raw` feature: inject raw text into the query.

## [0.10.0] - 2016-10-06

### Added

- escaping strings

## [0.9.0] - 2016-09-26

### Added

- `$group` Statement

## [0.8.7] - 2016-09-23

### Added

- `$count` feature for SELECT Statements
- `$max` feature for SELECT Statements
- `$min` feature for SELECT Statements
- `$sum` feature for SELECT Statements
- `$avg` feature for SELECT Statements

## [0.8.6] - 2016-09-22

### Added

- `$on` feature for JOIN operations

## [0.8.2] - 2016-09-06

### Added

- `$like` feature for WHERE operations
