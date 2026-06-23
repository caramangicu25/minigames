using MiniGames.BusinessLogic.Interfaces;
using MiniGames.BusinessLogic.Structure;

namespace MiniGames.BusinessLogic;

public class BusinessLogic
{
    public BusinessLogic() { }

    public IAuthLogic AuthAction() => new AuthActionExecution();

    public IScoreLogic ScoreAction() => new ScoreActionExecution();

    public IUserLogic UserAction() => new UserActionExecution();

    public IAchievementLogic AchievementAction() => new AchievementActionExecution();

    public IChallengeLogic ChallengeAction() => new ChallengeActionExecution();

    public IChatLogic ChatAction() => new ChatActionExecution();

    public IFriendLogic FriendAction() => new FriendActionExecution();
}
