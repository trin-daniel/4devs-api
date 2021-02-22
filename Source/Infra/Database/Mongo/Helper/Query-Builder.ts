export class QueryBuilder {
  private readonly Query: Array<object> = []

  Match (data: object): QueryBuilder {
    this.Query.push({
      $match: data
    })
    return this
  }

  Group (data: object): QueryBuilder {
    this.Query.push({
      $group: data
    })
    return this
  }

  Unwind (data: object): QueryBuilder {
    this.Query.push({
      $unwind: data
    })
    return this
  }

  Lookup (data: object): QueryBuilder {
    this.Query.push({
      $lookup: data
    })
    return this
  }

  AddFields (data: object): QueryBuilder {
    this.Query.push({
      $addFields: data
    })
    return this
  }

  Sort (data: object): QueryBuilder {
    this.Query.push({
      $sort: data
    })
    return this
  }

  Project (data: object): QueryBuilder {
    this.Query.push({
      $project: data
    })
    return this
  }

  Build (): object[] {
    return this.Query
  }
}
