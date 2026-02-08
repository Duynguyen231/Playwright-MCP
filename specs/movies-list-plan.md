# movies-list-plan

## Application Overview

Test plan for the Movies List feature: covers creating, viewing, editing, deleting, searching, sorting, pagination, import/export, persistence, errors, concurrency, and accessibility. Assumptions: tests start from a fresh application state (no user-saved movies), user is authenticated if required, and the app is reachable. Each scenario is independent and contains explicit steps, expected outcomes, success criteria, and failure conditions.

## Test Scenarios

### 1. Movies List Management

**Seed:** `tests/seed.spec.ts`

#### 1.1. Add Movie — Happy Path

**File:** `tests/movies/add-movie-happy.spec.ts`

**Steps:**
  1. Assumption: App is in fresh state with empty movies list.
  2. Open the Movies page.
  3. Click the 'Add Movie' button.
  4. Fill the form with valid values: Title, Year, Genre, Rating, and Description.
  5. Submit the form.
  6. Observe the movies list and any confirmation toast or dialog.

**Expected Results:**
  - New movie appears in the list with correct Title, Year, Genre, and Rating.
  - Detail view (if shown) contains the Description and metadata.
  - Success criteria: movie count increments by 1 and UI shows confirmation. Failure: movie not listed or validation error unexpectedly shown.

#### 1.2. Add Movie — Validation Errors

**File:** `tests/movies/add-movie-validation.spec.ts`

**Steps:**
  1. Assumption: App is in fresh state.
  2. Open the Add Movie form.
  3. Leave required fields empty and submit.
  4. Enter invalid data for fields (e.g., non-numeric Year, rating outside allowed bounds) and submit.
  5. Try extremely long Title (> 255 chars) and submit.

**Expected Results:**
  - Appropriate validation messages appear for each invalid input.
  - Form prevents submission until required fields are valid.
  - Success criteria: each validation rule produces a clear message. Failure: form accepts invalid data or shows vague messages.

#### 1.3. Edit Movie — Happy Path

**File:** `tests/movies/edit-movie.spec.ts`

**Steps:**
  1. Assumption: A movie exists in the list (create one via API or UI before test).
  2. Open the Movies page and locate the existing movie.
  3. Open the movie's Edit form.
  4. Change multiple fields (Title, Rating, Description) and save.
  5. Return to the list and view details.

**Expected Results:**
  - Updated values show in the list and detail view.
  - Changes persist after page reload.
  - Success criteria: updated movie displays new values and no duplicate entries. Failure: old values remain or data loss occurs.

#### 1.4. Delete Movie — Single

**File:** `tests/movies/delete-movie.spec.ts`

**Steps:**
  1. Assumption: At least one movie exists in the list.
  2. Open the Movies page and locate a target movie.
  3. Click the Delete action for that movie.
  4. Confirm deletion in any confirmation dialog.
  5. Verify list content.

**Expected Results:**
  - Movie is removed from the list and movie count decrements by 1.
  - No leftover references or broken links to deleted movie. Failure: movie remains or UI inconsistent.

#### 1.5. Delete Movies — Bulk

**File:** `tests/movies/bulk-delete.spec.ts`

**Steps:**
  1. Assumption: Multiple movies exist (3+).
  2. Open the Movies page.
  3. Select multiple movies using checkboxes.
  4. Click the 'Delete selected' bulk action and confirm.
  5. Verify remaining movies and toast/notification.

**Expected Results:**
  - Selected movies are removed; non-selected movies remain.
  - Success criteria: bulk delete returns correct count and no partial deletes. Failure: wrong movies deleted or partial failures without clear error.

#### 1.6. View Movie Details

**File:** `tests/movies/view-movie-details.spec.ts`

**Steps:**
  1. Assumption: Movie exists with full metadata.
  2. Open the Movies page and click a movie title or 'View' action.
  3. Inspect the detail view (modal or page) for Title, Year, Genre, Rating, Description, Poster (if any), and actions (Edit/Delete).

**Expected Results:**
  - All movie metadata displays correctly and matches list values.
  - Detail view actions navigate or operate as expected. Failure: missing fields or incorrect data shown.

#### 1.7. Search / Filter Movies

**File:** `tests/movies/search-filter.spec.ts`

**Steps:**
  1. Assumption: Movies with varied titles/genres exist (at least 5).
  2. Open Movies page.
  3. Use search box to query by partial title and observe results.
  4. Apply genre filter and rating range filter separately and combined.
  5. Clear filters and verify full list restoration.

**Expected Results:**
  - Search returns only matching items; filters narrow list correctly and can be combined.
  - No false positives or missing matches for valid queries. Failure: filters ignored or inconsistent.

#### 1.8. Sort Movies

**File:** `tests/movies/sort-movies.spec.ts`

**Steps:**
  1. Assumption: Movies list has items with different Years, Titles, and Ratings.
  2. Open Movies page.
  3. Sort by Title ascending/descending and verify order.
  4. Sort by Year and Rating and verify numerical ordering.
  5. Combine sort + filter and verify stable ordering.

**Expected Results:**
  - List orders correctly for each sort key and direction.
  - Sorting remains consistent across pages (if paginated). Failure: unstable or incorrect sort ordering.

#### 1.9. Pagination / Infinite Scroll

**File:** `tests/movies/pagination.spec.ts`

**Steps:**
  1. Assumption: More movies exist than page size (e.g., > 20).
  2. Open Movies page.
  3. If paginated: navigate to next/previous pages, jump to a page number, and verify items change accordingly.
  4. If infinite scroll: scroll to load additional items and verify new items appear.
  5. Verify page-size change (if user-controllable).

**Expected Results:**
  - Pagination controls or infinite scroll load the correct items without duplication or gaps.
  - Page numbers reflect total pages and counts. Failure: missing items, duplicates, or inability to navigate.

#### 1.10. Import Movies — CSV (Happy Path)

**File:** `tests/movies/import-csv.spec.ts`

**Steps:**
  1. Assumption: App supports CSV import and import UI is available.
  2. Open Movies page and open Import dialog.
  3. Upload a valid CSV with multiple movies (valid fields).
  4. Confirm import and wait for completion.
  5. Verify imported movies appear in list with correct data.

**Expected Results:**
  - All valid rows import successfully; summary shows success count.
  - Bad rows are reported and not imported. Failure: import silently fails or corrupts data.

#### 1.11. Import Movies — Invalid File Handling

**File:** `tests/movies/import-csv-invalid.spec.ts`

**Steps:**
  1. Assumption: App supports file validation.
  2. Open Import dialog.
  3. Upload an invalid CSV (missing required columns) and a non-CSV file (e.g., .jpg).
  4. Attempt to import and observe errors.

**Expected Results:**
  - Clear error messages explain the validation issue; no partial corrupt imports.
  - Upload of disallowed file types is rejected. Failure: app crashes or accepts invalid files.

#### 1.12. Export Movies

**File:** `tests/movies/export-movies.spec.ts`

**Steps:**
  1. Assumption: Export action exists and user has at least one movie.
  2. Open Movies page and click Export.
  3. Choose export format (CSV/JSON) if offered.
  4. Download exported file and open it.
  5. Compare exported records to current list.

**Expected Results:**
  - Exported file downloads and contains accurate records matching current list and filters (if export respects filters). Failure: missing fields or corrupted file.

#### 1.13. Persistence Across Reload / Session

**File:** `tests/movies/persistence.spec.ts`

**Steps:**
  1. Assumption: App persists data server-side or localStorage.
  2. Add or edit a movie.
  3. Reload the page and sign out/in if applicable.
  4. Verify that changes persist and are visible after reload or new session.

**Expected Results:**
  - Changes persist across reloads and new sessions. Failure: changes lost on reload or after sign-in.

#### 1.14. Concurrent Edit Conflict

**File:** `tests/movies/concurrent-edit.spec.ts`

**Steps:**
  1. Assumption: Two sessions can be simulated (two browser contexts or API calls).
  2. Open the same movie in two sessions.
  3. In session A, change Title and save.
  4. In session B, change Description and save (later than A).
  5. Observe conflict handling or last-write behavior.

**Expected Results:**
  - App detects concurrent edits and presents merge/conflict resolution or documents last-write policy.
  - No silent overwrites without notification. Failure: silent data loss or inconsistent state.

#### 1.15. Offline / Network Failure Handling

**File:** `tests/movies/network-failure.spec.ts`

**Steps:**
  1. Assumption: App should gracefully handle network errors.
  2. Open Movies page.
  3. Simulate offline/network error (developer tools or network throttle).
  4. Attempt to add or edit a movie while offline.
  5. Restore network and retry/save if applicable.

**Expected Results:**
  - App shows offline notification and prevents/queues operations with clear messaging.
  - On network restore, queued operations succeed or provide explicit retry. Failure: app crashes or loses user input.

#### 1.16. Accessibility — Keyboard Navigation & Screen Reader

**File:** `tests/movies/accessibility.spec.ts`

**Steps:**
  1. Assumption: Accessibility support is a requirement.
  2. Open Movies page.
  3. Navigate the page using keyboard only (Tab, Enter, Arrow keys) to add, edit, delete, paginate, and filter movies.
  4. Check that form fields have labels, buttons have accessible names, and ARIA roles exist for lists/modals.
  5. Run automated accessibility checks (axe/core) on the page.

**Expected Results:**
  - All interactive elements reachable and operable via keyboard; no major accessibility violations from automated checks.
  - Screen reader labels and roles present for key components. Failure: inaccessible controls or missing labels.
