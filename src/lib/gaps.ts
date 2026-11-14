/**
 * The five open holes in Railhead's verifier, as data.
 *
 * Each is a strict `xfail` in `tests/unit/test_redteam.py` at the pinned commit:
 * the test states the secure outcome, fails on purpose, and its `reason=` names
 * the design decision that is still missing. The names and the "fix" lines below
 * are the upstream repo's own words, trimmed; nothing here is invented, and a
 * gap that closes should be deleted from this file with the test.
 *
 * The threat model is the useful frame: an agent can read and rewrite the log
 * and the state files under `run/`, and can call `rh` any way it likes, but it
 * cannot run its own engine and cannot touch the verifier process.
 */

export type Gap = {
  /** the test that fails on purpose */
  test: string
  title: string
  /** the attack, in one sentence */
  attack: string
  /** what the author's own reason line says is missing */
  fix: string
}

export const VERIFIED_AT = '6158e15'

export const GAPS: Gap[] = [
  {
    test: 'test_attack_deleting_the_fork_budget_file_does_not_reset_it',
    title: 'The fork budget is a file, not part of the log',
    attack:
      'Delete run/forks.json and send a shutdown on the socket — no kill needed — and the fork budget resets to full.',
    fix: 'Log fork use as meta records, digested in a v2 log, and rebuild the budget from the log.',
  },
  {
    test: 'test_attack_cutting_the_log_before_a_failed_promise_does_not_pay',
    title: 'Nothing outside the container binds the log length',
    attack:
      'Cut the log — back to the header — after seeing a bad result. In the bid family, an absent promise pays 0.5, more than a failed one.',
    fix: 'Bind the log length to something outside the container, or make a missing promise pay less than a failed one.',
  },
  {
    test: 'test_attack_rewind_by_cutting_the_log_and_restarting_the_daemon',
    title: 'The daemon recovers by replaying whatever the log holds',
    attack:
      'Wait, see the result, shut the daemon down through the socket, cut the log, run rh status: the world is back at the cut. This is the private-engine attack of M1, done without a private engine.',
    fix: 'A recovery that cannot go backwards in time, or a verifier that notices the world moved forward without the log.',
  },
  {
    test: 'test_attack_abstain_after_the_horizon_does_not_pay',
    title: 'Abstain has no deadline',
    attack:
      'The daemon accepts meta records after the horizon and after submit. On an infeasible contract, try, fail, and abstain on the last day for reward 1.',
    fix: 'Give abstain the bid deadline, or refuse meta records after the horizon.',
  },
  {
    test: 'test_attack_oversized_log_is_rejected_before_replay',
    title: 'There is no size bound on the log',
    attack:
      'A Harbor verifier time-out writes no reward file at all, which a trainer reads as a dropout rather than a rejection.',
    fix: 'A cap of a few megabytes, or a time budget that ends in rejected = 1. Either needs an owner decision.',
  },
]
