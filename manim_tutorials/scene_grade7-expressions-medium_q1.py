from manim import *

class Grade7ExpressionsMedium(Scene):
    def construct(self):
        # Expression
        expression = MathTex("4x + 2y - x + 5y").to_edge(UP)
        self.play(Write(expression))
        self.wait(1)

        # Combining x terms
        combining_x = MathTex("(4x - x) + 2y + 5y").next_to(expression, DOWN)
        self.play(Write(combining_x))
        self.wait(1)

        # Combining y terms
        combining_y = MathTex("3x + (2y + 5y)").next_to(combining_x, DOWN)
        self.play(Write(combining_y))
        self.wait(1)

        # Simplified Expression
        simplified_expression = MathTex("3x + 7y").next_to(combining_y, DOWN)
        self.play(Write(simplified_expression))
        self.wait(2)