class PlayerStats
  include ActiveModel::SerializerSupport

  def initialize(player)
    @player = player
  end

  def points_won_count
    Neo4j::Session.current.query(<<-CYPHER, :id => @player.id.to_i).first[:points_won]
      MATCH (p:`Player`)<-[r:`GameSet#scores`]-()
      WHERE id(p) = {id}
      RETURN sum(r.value) AS points_won
    CYPHER
  end

  def points_lost_count
    Neo4j::Session.current.query(<<-CYPHER, :id => @player.id.to_i).first[:points_lost]
      MATCH (p:`Player`)<-[:`GameSet#scores`]-()-[r:`GameSet#scores`]->(p2:`Player`)
      WHERE id(p) = {id} AND id(p2) <> {id}
      RETURN sum(r.value) AS points_lost
    CYPHER
  end

  def games_lost_count
    @player.lost_games.count
  end

  def games_won_count
    @player.won_games.count
  end

  def tournaments_won_count
    @player.won_tournaments.count
  end

  def worst_defeat
    aggregate_game(:min)
  end

  def greatest_victory
    aggregate_game(:max)
  end

  private

  def aggregate_game(agg)
    result = Neo4j::Session.current.query(<<-CYPHER, :id => @player.id.to_i)
      MATCH (player:`Player`)<-[:`Pairing#players`]-(pairing:`Pairing`),
            (pairing)-[:`Game#pairing`]-(game:`Game`),
            (game)-[:`Game#game_sets`]-(game_set),
            (game_set)-[player_score:`GameSet#scores`]-(player),
            (game_set)-[rival_score:`GameSet#scores`]-(rival)
      WHERE id(player) = {id} AND id(rival) <> {id}
      WITH id(game) AS game_id, sum(player_score.value - rival_score.value) AS diff
      WHERE diff #{agg == :min ? "<" : ">"} 0
      RETURN game_id AS game_id, #{agg}(diff) AS diff
    CYPHER

    if result.first
      Neo4j::Node.load result.first[:game_id]
    else
      nil
    end
  end

end