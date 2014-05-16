class FindPairing < Mutations::Command
  required do
    array :players
  end

  def validate
    if players.compact.size != 2
      add_error(:players, :invalid, "Two players needed to create a game")
    end
  end

  def execute
    result = Neo4j::Session.current.query <<-CYPHER
      MATCH (p1:`Player`), (p2:`Player`)
      WHERE id(p1) = #{id1} AND id(p2) = #{id2}
      CREATE UNIQUE (p1)-[:`Pairing#players`]-(pairing:`Pairing`)-[:`Pairing#players`]-(p2)
      RETURN id(pairing) AS pairing_id
    CYPHER

    Neo4j::Node.load result.first[:pairing_id]
  end

  private

  def id1
    players[0].id
  end

  def id2
    players[1].id
  end
end
