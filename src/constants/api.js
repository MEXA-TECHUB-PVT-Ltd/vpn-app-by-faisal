// const BASE_URL = 'http://disciplineguru.co/backend/apis/';
const BASE_URL = 'https://betterself.cloud/test/apis/';
//27
export const api = {
  create_user: BASE_URL + 'user/create_user.php',
  update_user: BASE_URL + 'user/update.php',
  get_all_motivational_quotes: BASE_URL + 'motivational_quote/getAll.php',
  get_all_wallpapers: BASE_URL + 'wallpapers/getAll.php',

  //journal
  create_journal: BASE_URL + 'journal/create.php',
  get_all_journal_by_userId: BASE_URL + 'journal/getAllbyUid.php',
  delete_journal: BASE_URL + 'journal/delete.php',
  update_journal: BASE_URL + 'journal/update.php',

  //tasks
  create_tasks: BASE_URL + 'tasks/create.php',
  get_all_task_by_UID: BASE_URL + 'tasks/getAllbyUid.php',
  get_all_task_by_UID_and_date: BASE_URL + 'tasks/getAllbyUidandDate.php',
  delete_tasks: BASE_URL + 'tasks/delete.php',
  update_tasks: BASE_URL + 'tasks/update.php',
  update_task_status: BASE_URL + 'tasks/update_status.php',

  //motivational_music
  get_all_motivational_music: BASE_URL + '/motivational_music/getAll.php',

  //challenge
  create_challenge: BASE_URL + 'challenge/create.php',
  create_challenge_days: BASE_URL + 'challenge/create_challenge_days.php',
  get_all_challenges: BASE_URL + 'challenge/getAll.php',
  get_single_challenge_detail: BASE_URL + 'challenge/getSingle.php',

  get_all_challenge_byAddedType_and_community_status:
    BASE_URL + 'challenge/getAllbyAddedTypeandCommunityStatus.php',
  get_all_challenges_by_type: BASE_URL + 'challenge/getAllbyAddedType.php',
  delete_challenge: BASE_URL + 'challenge/delete.php',
  update_challenge: BASE_URL + 'challenge/update.php',
  update_challenge_days_description:
    BASE_URL + 'challenge/updateChallengeDayDescription.php',

  //start challenge
  start_challenge: BASE_URL + 'user_challenge/start.php',
  get_started_challenge: BASE_URL + 'user_challenge/getaStartedChallenge.php',
  update_day_complete_status:
    BASE_URL + 'user_challenge/updateDayCompleteStatus.php',
  restart_a_challenge: BASE_URL + 'user_challenge/restartaChallenge.php',
  get_all_started_challenge_of_user:
    BASE_URL + 'user_challenge/getallStartedChallengeofaUser.php',

  //hidden challenges
  hide_a_challenge: BASE_URL + 'user_challenge/hideAchallenge.php',
  get_all_hidden_challenges_of_a_user:
    BASE_URL + 'user_challenge/getAllHiddenChallengeofaUser.php',

  //like challenge
  like_challenge: BASE_URL + 'like/likeaChallenge.php',
  dislike_challenge: BASE_URL + 'like/dislikeaChallenge.php',
  get_all_like_challenges_by_user:
    BASE_URL + 'challenge/getAllChallengeLikedByUser.php',
  get_all_like_challenges_by_user_new:
    BASE_URL + 'challenge/getallchallengelikebysingleuser.php',

  //books
  get_all_books: BASE_URL + 'books/getAll.php',
  get_book_detail: BASE_URL + 'books/getSingle.php',

  //latest remaining
  get_started_challenge_detail:
    BASE_URL + 'user_challenge/getaStartedChallengeByUniqId.php',

  share_challenge_to_community:
    BASE_URL + 'challenge/sendChallengetoCommunity.php',

  get_search_suggestions_community:
    BASE_URL + 'challenge/searchSuggestioninCommunity.php',

  search_with_in_community: BASE_URL + 'challenge/searchWithinCommunity.php',

  get_all_by_community_status:
    BASE_URL + 'challenge/getAllbyCommunityStatus.php',

  //new api's
  complete_challenge: BASE_URL + 'user_challenge/completechallenge.php',
  get_user_all_completed_challenges:
    BASE_URL + 'user_challenge/getuserallcompletedchallenges.php',
};
