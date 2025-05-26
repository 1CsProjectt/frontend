/**
 * Check statuses in order and return overall status.
 * @param {Array<string|null>} statuses
 * @returns {'ACCEPTED'|'PENDING'|'DECLINED'}
 */
function deriveOverallStatus(statuses) {
    for (const st of statuses) {
      // 1. If null/empty ⇒ PENDING
      if (!st) {
        return 'PENDING';
      }
      // 2. If ACCEPTED ⇒ ACCEPTED
      if (st === 'ACCEPTED') {
        return 'ACCEPTED';
      }
      // 3. If DECLINED ⇒ skip to next
      //    (do nothing here)
    }
    // 4. All were DECLINED ⇒ DECLINED
    return 'DECLINED';
  }
  